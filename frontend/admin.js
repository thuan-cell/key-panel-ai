// Đăng nhập admin → Gọi API để bật quyền truy cập toàn cục
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    fetch("/api/grant-access", { method: "POST" })
      .then(() => {
        Swal.fire("Thành công", "Quyền đã cấp!", "success")
          .then(() => window.location.href = "/index.html");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

// Đăng xuất admin → Thu hồi quyền truy cập toàn cục
function adminLogout() {
  fetch("/api/revoke-access", { method: "POST" })
    .then(() => {
      Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi", "info")
        .then(() => window.location.reload());
    });
}
