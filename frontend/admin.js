const API_URL = "https://key-panel-aihtml1.onrender.com";

function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    fetch(`${API_URL}/api/grant-access`, { method: "POST" })
      .then(() => {
        localStorage.setItem("admin_granted", "true");
        Swal.fire("Thành công", "Quyền đã cấp!", "success")
          .then(() => window.location.href = "/index.html");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

function adminLogout() {
  fetch(`${API_URL}/api/revoke-access`, { method: "POST" })
    .then(() => {
      localStorage.setItem("admin_granted", "false");
      Swal.fire("Đăng xuất", "Đã thu hồi quyền", "info")
        .then(() => window.location.href = "/auth.html");
    });
}
