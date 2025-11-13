# 🗼 Tháp Hà Nội - Web Application

Mô phỏng thuật toán **Tháp Hà Nội** (Tower of Hanoi) với giao diện web đẹp mắt, sử dụng Flask + HTML5 Canvas + JavaScript.

## ✨ Tính năng

- 🎨 Giao diện web hiện đại, responsive
- 🎬 Animation mượt mà cho các bước di chuyển đĩa
- ⚡ Điều chỉnh tốc độ animation
- 🔢 Hỗ trợ 2-10 đĩa
- 📊 Hiển thị số bước và tiến trình
- 💡 Giải thích thuật toán "Chia để Trị"

## 🚀 Cách chạy trên máy local

### 1. Cài đặt Python

Đảm bảo bạn đã cài Python 3.7+ trên máy:

```bash
python --version
```

### 2. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 3. Chạy ứng dụng

```bash
python app.py
```

### 4. Mở trình duyệt

Truy cập: **http://localhost:5000**

## 📁 Cấu trúc thư mục

```
thaphanoi/
│
├── app.py                 # Flask server và API
├── thaphanoi.py          # Code Tkinter gốc (không dùng)
├── requirements.txt      # Python dependencies
│
├── templates/
│   └── index.html        # Giao diện HTML
│
└── static/
    ├── style.css         # Styling
    └── script.js         # JavaScript logic & animation
```

## 🌐 Deploy lên Internet

### Option 1: Render.com (Miễn phí) ⭐ Khuyến nghị

1. **Tạo file `render.yaml`** (tùy chọn):

```yaml
services:
  - type: web
    name: thaphanoi
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
```

2. **Cài Gunicorn** (production server):

```bash
pip install gunicorn
```

Thêm vào `requirements.txt`:

```
gunicorn==21.2.0
```

3. **Push code lên GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

4. **Deploy trên Render**:
   - Đăng ký tài khoản tại: https://render.com
   - Chọn "New" → "Web Service"
   - Connect GitHub repository
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Click "Create Web Service"

### Option 2: PythonAnywhere (Miễn phí)

1. Đăng ký tại: https://www.pythonanywhere.com
2. Upload code hoặc clone từ GitHub
3. Tạo Web App với Flask
4. Cấu hình WSGI file
5. Reload web app

### Option 3: Heroku

1. Tạo file `Procfile`:

```
web: gunicorn app:app
```

2. Deploy:

```bash
heroku login
heroku create thaphanoi-app
git push heroku main
```

### Option 4: Railway.app

1. Đăng ký tại: https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repository
4. Railway tự động detect và deploy

## 🎮 Cách sử dụng

1. Nhập số đĩa (2-10)
2. Nhấn nút **"Bắt đầu"**
3. Xem animation di chuyển đĩa
4. Có thể điều chỉnh tốc độ bằng slider
5. Nhấn **"Dừng"** để tạm dừng
6. Nhấn **"Reset"** để chơi lại

## 🧮 Thuật toán

**Tháp Hà Nội** là bài toán kinh điển của thuật toán **"Chia để Trị"** (Divide and Conquer):

- **Chia**: Chia bài toán n đĩa thành 3 bài toán con
- **Trị**: Trường hợp cơ sở (1 đĩa) → di chuyển trực tiếp
- **Tổng hợp**: Kết hợp các bước con

**Số bước tối thiểu**: 2^n - 1

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Canvas API**: Vẽ đồ họa
- **Responsive Design**: Mobile-friendly

## 📝 License

MIT License - Free to use

## 👨‍💻 Author

Made with ❤️ for learning algorithms

---

## 🐛 Troubleshooting

### Lỗi "Module not found"

```bash
pip install -r requirements.txt
```

### Port 5000 bị chiếm

Sửa trong `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

### Không kết nối được API

Kiểm tra:

- Flask server đang chạy
- Không có lỗi trong console
- URL đúng (http://localhost:5000)

---

## � Deploy lên Render.com

### Bước 1: Chuẩn bị

1. Tạo tài khoản miễn phí tại [render.com](https://render.com)
2. Tạo repository trên GitHub và push code

### Bước 2: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit - Thap Ha Noi web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thaphanoi.git
git push -u origin main
```

### Bước 3: Deploy trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository của bạn
4. Cấu hình:
   - **Name**: `thaphanoi` (hoặc tên bạn muốn)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free`
5. Click **"Create Web Service"**
6. Đợi 3-5 phút để deploy

### Bước 4: Truy cập

Render sẽ cung cấp URL dạng:
```
https://thaphanoi.onrender.com
```

⚠️ **Lưu ý**: Free tier sẽ sleep sau 15 phút không hoạt động, khởi động lại mất ~30 giây.

## �🎉 Demo

Sau khi deploy, bạn có thể chia sẻ link web app cho bạn bè!

**Enjoy coding! 🚀**
