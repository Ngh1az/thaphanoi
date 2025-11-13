from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

def tinh_buoc_di_thap_ha_noi(n, nguon, dich, trung_gian, buoc_di=[]):
    """
    Hàm đệ quy để tính toán các bước di chuyển của Tháp Hà Nội
    Sử dụng thuật toán "Chia để Trị"
    
    Args:
        n: Số đĩa cần di chuyển
        nguon: Tên cọc nguồn (A, B, C)
        dich: Tên cọc đích (A, B, C)
        trung_gian: Tên cọc trung gian (A, B, C)
        buoc_di: Danh sách các bước di chuyển (được truyền qua tham chiếu)
    
    Returns:
        Danh sách các bước di chuyển dưới dạng [(nguon, dich), ...]
    """
    # Trường hợp cơ sở: chỉ có 1 đĩa
    if n == 1:
        buoc_di.append({'from': nguon, 'to': dich})
        return buoc_di
    
    # Bước 1: Di chuyển n-1 đĩa từ nguồn sang trung gian (sử dụng đích làm trung gian)
    tinh_buoc_di_thap_ha_noi(n - 1, nguon, trung_gian, dich, buoc_di)
    
    # Bước 2: Di chuyển đĩa thứ n (lớn nhất) từ nguồn sang đích
    buoc_di.append({'from': nguon, 'to': dich})
    
    # Bước 3: Di chuyển n-1 đĩa từ trung gian sang đích (sử dụng nguồn làm trung gian)
    tinh_buoc_di_thap_ha_noi(n - 1, trung_gian, dich, nguon, buoc_di)
    
    return buoc_di

@app.route('/')
def index():
    """Trang chủ - render template HTML"""
    return render_template('index.html')

@app.route('/api/giai', methods=['POST'])
def giai_thap_ha_noi():
    """
    API endpoint để tính toán các bước giải Tháp Hà Nội
    
    Request JSON:
        {
            "so_dia": 3  // Số đĩa từ 2 đến 10
        }
    
    Response JSON:
        {
            "success": true/false,
            "so_dia": 3,
            "so_buoc": 7,
            "buoc_di": [
                {"from": "A", "to": "C"},
                ...
            ],
            "message": "Thông báo (nếu có lỗi)"
        }
    """
    try:
        data = request.get_json()
        so_dia = int(data.get('so_dia', 3))
        
        # Kiểm tra giá trị hợp lệ
        if not (2 <= so_dia <= 10):
            return jsonify({
                'success': False,
                'message': 'Số đĩa phải từ 2 đến 10!'
            }), 400
        
        # Tính toán các bước di chuyển
        buoc_di = []
        buoc_di = tinh_buoc_di_thap_ha_noi(so_dia, 'A', 'C', 'B', buoc_di)
        
        return jsonify({
            'success': True,
            'so_dia': so_dia,
            'so_buoc': len(buoc_di),
            'buoc_di': buoc_di
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi: {str(e)}'
        }), 500

if __name__ == '__main__':
    import os
    # Chạy Flask app ở chế độ debug
    # Host 0.0.0.0 để có thể truy cập từ các máy khác trong mạng
    # Port lấy từ environment variable PORT (Render tự set) hoặc mặc định 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
