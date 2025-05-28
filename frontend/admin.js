function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    // ✅ Ghi trạng thái quyền admin vào localStorage
    localStorage.setItem("admin_granted", "true");

    Swal.fire("Thành công", "Đã cấp quyền truy cập!", "success")
      .then(() => window.location.href = "/index.html");
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

function adminLogout() {
  // ✅ Xóa quyền admin khỏi localStorage
  localStorage.removeItem("admin_granted");

  Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi", "info")
    .then(() => window.location.reload());
}
