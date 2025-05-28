
// File: frontend/admin.js
/*
  Script cho trang admin.html.
  Xử lý sự kiện click cho các nút đăng nhập và đăng xuất admin.
  Gửi yêu cầu POST đến backend để cập nhật trạng thái admin.
*/
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const messageDiv = document.getElementById('message');

    // Hàm hiển thị thông báo
    function showMessage(msg, isError = false) {
        messageDiv.textContent = msg;
        messageDiv.className = isError ? 'error' : '';
    }

    // Hàm gửi yêu cầu POST đến backend
    async function sendAdminAction(endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message);
            } else {
                showMessage(`Lỗi: ${data.message}`, true);
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc server:', error);
            showMessage('Lỗi kết nối đến server.', true);
        }
    }

    // Lắng nghe sự kiện click nút Đăng nhập
    loginBtn.addEventListener('click', () => {
        sendAdminAction('/api/admin/login');
    });

    // Lắng nghe sự kiện click nút Đăng xuất
    logoutBtn.addEventListener('click', () => {
        sendAdminAction('/api/admin/logout');
    });
});
