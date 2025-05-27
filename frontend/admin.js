function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    // Gọi API để cấp quyền
    fetch("/api/grant-access", { method: "POST" })
      .then(() => {
        Swal.fire("Thành công", "Quyền truy cập đã được cấp!", "success")
          .then(() => window.location.href = "/index.html");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}
