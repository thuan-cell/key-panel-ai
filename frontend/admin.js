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
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    fetch("/api/grant-access", { method: "POST" })
      .then(() => {
        Swal.fire("Thành công", "Đã cấp quyền truy cập!", "success")
          .then(() => window.location.href = "/index.html");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

function adminLogout() {
  fetch("/api/revoke-access", { method: "POST" })
    .then(() => {
      Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi", "info")
        .then(() => window.location.reload());
    });
}
