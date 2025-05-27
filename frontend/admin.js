function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu", "error");
    return;
  }

  if (username === "admin" && password === "admin123") {
    // Đăng nhập thành công → lưu trạng thái admin và cấp quyền từ xa
    localStorage.setItem("adminLoggedIn", "true");
    fetch("/api/grant-access", { method: "POST" })
      .then(() => {
        Swal.fire("Thành công", "Đã cấp quyền truy cập", "success")
          .then(() => window.location.href = "/index.html");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu quản trị", "error");
  }
}

function adminLogout() {
  localStorage.removeItem("adminLoggedIn");
  fetch("/api/revoke-access", { method: "POST" })
    .then(() => {
      Swal.fire("Đăng xuất", "Đã thu hồi quyền truy cập", "info")
        .then(() => window.location.href = "/admin.html");
    });
}
