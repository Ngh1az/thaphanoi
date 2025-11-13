// Các hằng số cho canvas
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const COC_WIDTH = 10;
const COC_SPACING = 240;
const DIA_HEIGHT = 20;
const DIA_MIN_WIDTH = 40;
const DIA_STEP_WIDTH = 20;
const BASE_Y = 350;

// Màu sắc cho các đĩa
const COLORS = [
  "#FF0000",
  "#FF7F00",
  "#FFFF00",
  "#00FF00",
  "#0000FF",
  "#4B0082",
  "#9400D3",
  "#FF1493",
  "#00FFFF",
  "#808080",
];

// Lấy các elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnBatDau = document.getElementById("btn-bat-dau");
const btnDung = document.getElementById("btn-dung");
const btnReset = document.getElementById("btn-reset");
const inputSoDia = document.getElementById("so-dia");
const inputTocDo = document.getElementById("toc-do");
const speedLabel = document.getElementById("speed-label");
const soBuocEl = document.getElementById("so-buoc");
const buocHienTaiEl = document.getElementById("buoc-hien-tai");
const trangThaiEl = document.getElementById("trang-thai");
const historyList = document.getElementById("history-list");
const btnClearHistory = document.getElementById("btn-clear-history");

// Biến trạng thái
let soDia = 3;
let viTriCoc = { A: 0, B: 0, C: 0 };
let trangThaiDia = { A: [], B: [], C: [] };
let cacBuocDi = [];
let buocHienTai = 0;
let dangChay = false;
let tocDoAnimation = 500; // milliseconds
let animationTimeout = null;

// Biến theo dõi Chia để Trị
let recursionCount = 0;
let maxDepth = 0;
let currentDepth = 0;
let moveDescriptions = []; // Lưu mô tả cho từng bước

// Khởi tạo
init();

// Event listeners
btnBatDau.addEventListener("click", batDau);
btnDung.addEventListener("click", dungLai);
btnReset.addEventListener("click", reset);
btnClearHistory.addEventListener("click", clearHistory);
inputTocDo.addEventListener("input", updateTocDo);
inputSoDia.addEventListener("change", function () {
  if (!dangChay) {
    reset();
  }
});

function init() {
  // Tính toán vị trí các cọc
  viTriCoc["A"] = CANVAS_WIDTH / 2 - COC_SPACING;
  viTriCoc["B"] = CANVAS_WIDTH / 2;
  viTriCoc["C"] = CANVAS_WIDTH / 2 + COC_SPACING;

  veNenTang();
  reset();
}

function veNenTang() {
  // Xóa canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Vẽ đế
  ctx.strokeStyle = "#333";
  ctx.lineWidth = COC_WIDTH;
  ctx.beginPath();
  ctx.moveTo(20, BASE_Y);
  ctx.lineTo(CANVAS_WIDTH - 20, BASE_Y);
  ctx.stroke();

  // Vẽ 3 cọc
  ctx.fillStyle = "#888";
  for (let coc of ["A", "B", "C"]) {
    let x = viTriCoc[coc];
    ctx.fillRect(x - COC_WIDTH / 2, BASE_Y - 250, COC_WIDTH, 250);

    // Vẽ tên cọc
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(coc, x, BASE_Y + 30);
    ctx.fillStyle = "#888";
  }
}

function veDia(coc, viTri, kichThuoc) {
  // viTri: 0 là đáy, 1, 2, 3... là các tầng
  const width = DIA_MIN_WIDTH + (kichThuoc - 1) * DIA_STEP_WIDTH;
  const x = viTriCoc[coc];
  const y = BASE_Y - (viTri + 1) * DIA_HEIGHT;

  const color = COLORS[(kichThuoc - 1) % COLORS.length];

  // Vẽ shadow 3D (bóng đổ)
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // Vẽ đĩa với gradient 3D
  const gradient = ctx.createLinearGradient(
    x - width / 2,
    y,
    x + width / 2,
    y + DIA_HEIGHT
  );
  gradient.addColorStop(0, lightenColor(color, 30));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, darkenColor(color, 20));

  ctx.fillStyle = gradient;
  ctx.fillRect(x - width / 2, y, width, DIA_HEIGHT);

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Viền đĩa với hiệu ứng sáng
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - width / 2, y, width, DIA_HEIGHT);

  // Thêm highlight trên đĩa
  const highlightGradient = ctx.createLinearGradient(
    x - width / 2,
    y,
    x + width / 2,
    y + 5
  );
  highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  highlightGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
  highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");

  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x - width / 2, y, width, 5);
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function veToaTrang() {
  veNenTang();

  // Vẽ tất cả các đĩa theo trạng thái hiện tại
  for (let coc of ["A", "B", "C"]) {
    for (let i = 0; i < trangThaiDia[coc].length; i++) {
      const kichThuoc = trangThaiDia[coc][i];
      veDia(coc, i, kichThuoc);
    }
  }
}

function khoiTaoDia() {
  // Reset trạng thái
  trangThaiDia = { A: [], B: [], C: [] };

  // Đặt tất cả đĩa lên cọc A (từ lớn đến nhỏ)
  for (let i = soDia; i >= 1; i--) {
    trangThaiDia["A"].push(i);
  }

  veToaTrang();
}

async function batDau() {
  if (dangChay) return;

  // Lấy số đĩa
  soDia = parseInt(inputSoDia.value);
  if (soDia < 2 || soDia > 10) {
    alert("Số đĩa phải từ 2 đến 10!");
    return;
  }

  // Disable các controls
  btnBatDau.disabled = true;
  btnDung.disabled = false;
  inputSoDia.disabled = true;
  dangChay = true;

  // Reset thống kê Chia để Trị
  recursionCount = 0;
  maxDepth = 0;
  currentDepth = 0;
  moveDescriptions = [];

  // Cập nhật trạng thái
  trangThaiEl.textContent = "Đang tính toán...";
  document.querySelector(".container").classList.add("animating");

  try {
    // Gọi API để lấy các bước di chuyển
    const response = await fetch("/api/giai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ so_dia: soDia }),
    });

    const data = await response.json();

    if (data.success) {
      cacBuocDi = data.buoc_di;
      soBuocEl.textContent = data.so_buoc;
      buocHienTai = 0;
      buocHienTaiEl.textContent = "0";

      // Cập nhật thống kê Chia để Trị
      const totalMoves = Math.pow(2, soDia) - 1;
      document.getElementById("de-quy-count").textContent = totalMoves;
      document.getElementById("do-sau").textContent = soDia;
      animateStatUpdate("de-quy-count");
      animateStatUpdate("do-sau");

      // Tạo mô tả cho từng bước
      generateMoveDescriptions();

      // Khởi tạo đĩa
      khoiTaoDia();

      // Bắt đầu animation
      trangThaiEl.textContent = "Đang chạy...";
      await thucHienAnimation();
    } else {
      alert(data.message);
      reset();
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối đến server!");
    reset();
  }
}

function dungLai() {
  if (!dangChay) return;

  dangChay = false;
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }

  btnBatDau.disabled = false;
  btnDung.disabled = true;
  trangThaiEl.textContent = "Đã dừng";
  document.querySelector(".container").classList.remove("animating");
}

function reset() {
  // Dừng animation nếu đang chạy
  dungLai();

  // Reset trạng thái
  soDia = parseInt(inputSoDia.value) || 3;
  cacBuocDi = [];
  buocHienTai = 0;

  // Reset thống kê Chia để Trị
  recursionCount = 0;
  maxDepth = 0;
  currentDepth = 0;
  moveDescriptions = [];

  // Cập nhật UI
  soBuocEl.textContent = "0";
  buocHienTaiEl.textContent = "0";
  trangThaiEl.textContent = "Sẵn sàng";
  document.getElementById("de-quy-count").textContent = "0";
  document.getElementById("do-sau").textContent = "0";
  document.getElementById("buoc-de-quy").textContent = "-";
  document.getElementById("buoc-giai-thich").textContent = "Đang chờ...";
  document.getElementById("move-description").textContent = "Chưa bắt đầu...";

  // Xóa lịch sử
  clearHistory();

  inputSoDia.disabled = false;
  btnBatDau.disabled = false;
  btnDung.disabled = true;

  // Vẽ lại
  khoiTaoDia();
}

async function thucHienAnimation() {
  if (!dangChay || buocHienTai >= cacBuocDi.length) {
    // Hoàn thành
    trangThaiEl.textContent = "Hoàn thành! 🎉";
    document.querySelector(".container").classList.remove("animating");
    btnBatDau.disabled = false;
    btnDung.disabled = true;
    inputSoDia.disabled = false;
    dangChay = false;
    return;
  }

  const buoc = cacBuocDi[buocHienTai];
  const from = buoc.from;
  const to = buoc.to;

  // Cập nhật mô tả bước di chuyển
  updateMoveDescription(buocHienTai);

  // Lấy đĩa từ cọc nguồn
  const dia = trangThaiDia[from].pop();

  // Animation: nâng lên -> di chuyển ngang -> hạ xuống
  await animateDiaMove(from, to, dia);

  // Đặt đĩa xuống cọc đích
  trangThaiDia[to].push(dia);

  // Cập nhật bước hiện tại
  buocHienTai++;
  buocHienTaiEl.textContent = buocHienTai;

  // Vẽ lại trạng thái mới
  veToaTrang();

  // Tiếp tục bước tiếp theo
  animationTimeout = setTimeout(() => thucHienAnimation(), tocDoAnimation);
}

async function animateDiaMove(from, to, kichThuoc) {
  const width = DIA_MIN_WIDTH + (kichThuoc - 1) * DIA_STEP_WIDTH;
  const color = COLORS[(kichThuoc - 1) % COLORS.length];

  // Vị trí ban đầu
  const startX = viTriCoc[from];
  const startViTri = trangThaiDia[from].length; // Vị trí trước khi pop
  const startY = BASE_Y - (startViTri + 1) * DIA_HEIGHT;

  // Vị trí đích
  const endX = viTriCoc[to];
  const endViTri = trangThaiDia[to].length; // Vị trí sẽ đặt
  const endY = BASE_Y - (endViTri + 1) * DIA_HEIGHT;

  const topY = 50; // Độ cao nâng lên
  const steps = 20;
  const delay = tocDoAnimation / (steps * 3);

  // Phase 1: Nâng lên
  for (let i = 0; i <= steps; i++) {
    const y = startY + (topY - startY) * (i / steps);
    veNenTang();

    // Vẽ các đĩa khác
    for (let coc of ["A", "B", "C"]) {
      for (let j = 0; j < trangThaiDia[coc].length; j++) {
        veDia(coc, j, trangThaiDia[coc][j]);
      }
    }

    // Vẽ đĩa đang di chuyển với hiệu ứng 3D
    drawMovingDisk(startX, y, width, color);

    await sleep(delay);
  }

  // Phase 2: Di chuyển ngang
  for (let i = 0; i <= steps; i++) {
    const x = startX + (endX - startX) * (i / steps);
    veNenTang();

    // Vẽ các đĩa khác
    for (let coc of ["A", "B", "C"]) {
      for (let j = 0; j < trangThaiDia[coc].length; j++) {
        veDia(coc, j, trangThaiDia[coc][j]);
      }
    }

    // Vẽ đĩa đang di chuyển với hiệu ứng 3D
    drawMovingDisk(x, topY, width, color);

    await sleep(delay);
  }

  // Phase 3: Hạ xuống
  for (let i = 0; i <= steps; i++) {
    const y = topY + (endY - topY) * (i / steps);
    veNenTang();

    // Vẽ các đĩa khác
    for (let coc of ["A", "B", "C"]) {
      for (let j = 0; j < trangThaiDia[coc].length; j++) {
        veDia(coc, j, trangThaiDia[coc][j]);
      }
    }

    // Vẽ đĩa đang di chuyển với hiệu ứng 3D
    drawMovingDisk(endX, y, width, color);

    await sleep(delay);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateTocDo() {
  const value = parseInt(inputTocDo.value);

  // Chuyển đổi từ 1-10 thành tốc độ (ms)
  // 1 = rất chậm (1000ms), 10 = rất nhanh (100ms)
  tocDoAnimation = 1100 - value * 100;

  // Cập nhật label
  if (value <= 3) {
    speedLabel.textContent = "Chậm";
  } else if (value <= 7) {
    speedLabel.textContent = "Trung bình";
  } else {
    speedLabel.textContent = "Nhanh";
  }
}

// === HÀM HỖ TRỢ CHIA ĐỂ TRỊ ===

function generateMoveDescriptions() {
  // Tạo mô tả chi tiết cho từng bước theo logic Chia để Trị
  moveDescriptions = [];
  recursionCount = 0;
  generateDescriptionsRecursive(soDia, "A", "C", "B", 1);
}

function generateDescriptionsRecursive(n, nguon, dich, trungGian, depth) {
  recursionCount++;

  if (n === 1) {
    // Trường hợp cơ sở (TRỊ)
    moveDescriptions.push({
      nguon: nguon,
      dich: dich,
      type: "base",
      depth: depth,
      description: `🎯 TRỊ: Di chuyển đĩa ${1} từ ${nguon} → ${dich} (Trường hợp cơ sở)`,
    });
    return;
  }

  // CHIA: Bước 1 - Chuyển n-1 đĩa từ nguồn → trung gian
  moveDescriptions.push({
    type: "divide",
    depth: depth,
    description: `📊 CHIA: Chuyển ${
      n - 1
    } đĩa từ ${nguon} → ${trungGian} (dùng ${dich} làm trung gian)`,
  });
  generateDescriptionsRecursive(n - 1, nguon, trungGian, dich, depth + 1);

  // Bước 2 - Chuyển đĩa lớn nhất
  moveDescriptions.push({
    nguon: nguon,
    dich: dich,
    type: "conquer",
    depth: depth,
    description: `⚡ CONQUER: Di chuyển đĩa ${n} (lớn nhất) từ ${nguon} → ${dich}`,
  });

  // CHIA: Bước 3 - Chuyển n-1 đĩa từ trung gian → đích
  moveDescriptions.push({
    type: "divide",
    depth: depth,
    description: `📊 CHIA: Chuyển ${
      n - 1
    } đĩa từ ${trungGian} → ${dich} (dùng ${nguon} làm trung gian)`,
  });
  generateDescriptionsRecursive(n - 1, trungGian, dich, nguon, depth + 1);
}

function updateMoveDescription(stepIndex) {
  const moveEl = document.getElementById("move-description");

  if (stepIndex < cacBuocDi.length) {
    const buoc = cacBuocDi[stepIndex];
    const nguon = buoc.from;
    const dich = buoc.to;

    // Tìm độ sâu đệ quy dựa vào bước hiện tại
    let currentRecursionDepth = 1;
    for (let i = 0; i < moveDescriptions.length; i++) {
      if (
        moveDescriptions[i].nguon === nguon &&
        moveDescriptions[i].dich === dich
      ) {
        currentRecursionDepth = moveDescriptions[i].depth || 1;
        break;
      }
    }

    const diskSize = trangThaiDia[nguon][trangThaiDia[nguon].length - 1];
    const description = `Di chuyển đĩa số ${diskSize} từ cọc ${nguon} → cọc ${dich}`;

    moveEl.textContent = description;
    moveEl.classList.add("new-move");
    setTimeout(() => moveEl.classList.remove("new-move"), 500);

    // Thêm vào lịch sử
    addToHistory(stepIndex + 1, nguon, dich, diskSize);

    // Cập nhật thông tin đệ quy
    document.getElementById("buoc-de-quy").textContent = `${stepIndex + 1}/${
      cacBuocDi.length
    }`;
    document.getElementById(
      "buoc-giai-thich"
    ).textContent = `Độ sâu: ${currentRecursionDepth}`;
    animateStatUpdate("buoc-de-quy");
  }
}

function animateStatUpdate(elementId) {
  const el = document.getElementById(elementId);
  el.classList.add("updated");
  setTimeout(() => el.classList.remove("updated"), 500);
}

// === HÀM QUẢN LÝ LỊCH SỬ ===

function addToHistory(stepNumber, from, to, diskSize) {
  // Xóa thông báo empty nếu có
  const emptyMsg = historyList.querySelector(".history-empty");
  if (emptyMsg) {
    emptyMsg.remove();
  }

  // Xóa class current từ tất cả items
  const allItems = historyList.querySelectorAll(".history-item");
  allItems.forEach((item) => item.classList.remove("current"));

  // Tạo item mới
  const historyItem = document.createElement("div");
  historyItem.className = "history-item current";
  historyItem.innerHTML = `
    <span class="step-number">Bước ${stepNumber}</span>
    <span class="step-description">Di chuyển đĩa số ${diskSize} từ cọc ${from} → cọc ${to}</span>
  `;

  // Thêm vào đầu danh sách
  historyList.insertBefore(historyItem, historyList.firstChild);

  // Cuộn lên đầu để xem item mới
  historyList.scrollTop = 0;

  // Enable nút clear
  btnClearHistory.disabled = false;
}

function clearHistory() {
  historyList.innerHTML =
    '<p class="history-empty">Chưa có bước nào được thực hiện...</p>';
  btnClearHistory.disabled = true;
}

function drawMovingDisk(x, y, width, color) {
  // Vẽ shadow 3D cho đĩa đang di chuyển (mạnh hơn)
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  // Vẽ đĩa với gradient 3D
  const gradient = ctx.createLinearGradient(
    x - width / 2,
    y,
    x + width / 2,
    y + DIA_HEIGHT
  );
  gradient.addColorStop(0, lightenColor(color, 40));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, darkenColor(color, 20));

  ctx.fillStyle = gradient;
  ctx.fillRect(x - width / 2, y, width, DIA_HEIGHT);

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Viền
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - width / 2, y, width, DIA_HEIGHT);

  // Highlight sáng hơn cho đĩa đang di chuyển
  const highlightGradient = ctx.createLinearGradient(
    x - width / 2,
    y,
    x + width / 2,
    y + 8
  );
  highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  highlightGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
  highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x - width / 2, y, width, 8);
}
