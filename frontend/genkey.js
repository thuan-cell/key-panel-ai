
// File: frontend/genkey.js
/*
  Script cho trang genkey.html.
  Kiểm tra trạng thái admin từ backend định kỳ.
  Kích hoạt hoặc vô hiệu hóa nút "Tạo Key" dựa trên trạng thái admin.
*/
document.addEventListener('DOMContentLoaded', () => {
    const generateKeyBtn = document.getElementById('generateKeyBtn');
    const statusDiv = document.getElementById('status');

    // Hàm kiểm tra trạng thái admin từ backend
    async function checkAdminStatus() {
        try {
            const response = await fetch('/api/admin/status');
            const data = await response.json();
            const isAdminGranted = data.admin_granted === true;

            // Cập nhật trạng thái nút
            generateKeyBtn.disabled = !isAdminGranted;

            // Cập nhật hiển thị trạng thái
            if (isAdminGranted) {
                statusDiv.textContent = 'Trạng thái Admin: Đã đăng nhập';
                statusDiv.className = 'admin-active';
            } else {
                statusDiv.textContent = 'Trạng thái Admin: Đã đăng xuất';
                statusDiv.className = 'admin-inactive';
            }

        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái admin:', error);
            statusDiv.textContent = 'Trạng thái Admin: Lỗi kết nối';
            statusDiv.className = 'admin-inactive';
            generateKeyBtn.disabled = true; // Vô hiệu hóa nút nếu có lỗi
        }
    }

    // Hàm xử lý khi nút "Tạo Key" được click (chỉ chạy khi nút không bị disabled)
    generateKeyBtn.addEventListener('click', () => {
        if (!generateKeyBtn.disabled) {
            alert('Chức năng Tạo Key được kích hoạt!');
            // TODO: Thêm logic tạo key thực tế ở đây
        }
    });

    // Kiểm tra trạng thái admin lần đầu khi tải trang
    checkAdminStatus();

    // Kiểm tra trạng thái admin định kỳ (ví dụ: mỗi 5 giây)
    // Điều này giúp cập nhật trạng thái nút nếu admin đăng nhập/đăng xuất ở tab khác
    setInterval(checkAdminStatus, 5000); // 5000ms = 5 giây
});
