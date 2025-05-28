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
// Đăng nhập admin → Gọi API để bật quyền truy cập toàn cục
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    fetch("https://key-panel-ai3.onrender.com/api/grant-access", {
      method: "POST"
    })
      .then(res => {
        if (!res.ok) throw new Error("Grant access failed");
        return res.json();
      })
      .then(() => {
        // Lưu trạng thái admin local (optional nếu muốn lưu cục bộ)
        localStorage.setItem("admin_granted", "true");

        Swal.fire("Thành công", "Quyền đã cấp!", "success")
          .then(() => window.location.href = "/index.html");
      })
      .catch(err => {
        console.error("Lỗi grant-access:", err);
        Swal.fire("Lỗi", "Không thể cấp quyền truy cập", "error");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}

// Đăng xuất admin → Thu hồi quyền truy cập toàn cục
function adminLogout() {
  fetch("https://key-panel-ai3.onrender.com/api/revoke-access", {
    method: "POST"
  })
    .then(res => {
      if (!res.ok) throw new Error("Revoke failed");
      return res.json();
    })
    .then(() => {
      // Xóa local flag nếu có
      localStorage.removeItem("admin_granted");

      Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi", "info")
        .then(() => window.location.reload());
    })
    .catch(err => {
      console.error("Lỗi revoke-access:", err);
      Swal.fire("Lỗi", "Không thể thu hồi quyền truy cập", "error");
    });
}
