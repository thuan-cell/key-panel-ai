function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("admin_granted", "true");
    Swal.fire("Thành công", "Admin đã đăng nhập!", "success")
      .then(() => window.location.href = "/index.html");
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

function adminLogout() {
  localStorage.removeItem("admin_granted");
  Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi.", "info")
    .then(() => window.location.href = "/auth.html");
}
