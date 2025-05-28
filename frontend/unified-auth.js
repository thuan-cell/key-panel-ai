// unified-auth.js

const API_LOGIN = "/api/login";

// Lưu trạng thái đăng nhập trong sessionStorage
function setLoggedIn(username) {
  sessionStorage.setItem("loggedInUser", username);
}

function getLoggedInUser() {
  return sessionStorage.getItem("loggedInUser");
}

function clearLogin() {
  sessionStorage.removeItem("loggedInUser");
}

// Kiểm tra trạng thái đăng nhập (true/false)
function checkAuthStatus() {
  return !!getLoggedInUser();
}

// Chuyển hướng nếu chưa đăng nhập (dùng cho các trang index.html, tool... )
function requireAuth() {
  if (!checkAuthStatus()) {
    Swal.fire({
      icon: "error",
      title: "Từ chối truy cập",
      text: "Bạn phải đăng nhập.",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.href = "/auth.html";
    });
    return false;
  }
  return true;
}

// Hàm đăng xuất
function logout() {
  clearLogin();
  window.location.href = "/auth.html";
}

// Xử lý sự kiện đăng nhập trên trang auth.html
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return; // Nếu không phải trang đăng nhập thì bỏ qua

  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", "warning");
      return;
    }

    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setLoggedIn(username);
        Swal.fire("Thành công", data.message, "success").then(() => {
          window.location.href = "/index.html";
        });
      } else {
        Swal.fire("Lỗi đăng nhập", data.message || "Đăng nhập thất bại", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
    }
  });
});
