const API_BASE = ""; // Render: tự động theo domain

function showRegister() {
  $('#loginForm').hide();
  $('#registerForm').show();
}

function showLogin() {
  $('#registerForm').hide();
  $('#loginForm').show();
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const text = await res.text();
    try {
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || text || "Lỗi đăng nhập không xác định");
      return data;
    } catch (e) {
      // Nếu không parse được JSON, trả về text hoặc lỗi mặc định
      if (res.ok) {
        // Nếu status ok mà ko parse được JSON thì coi như success với data rỗng
        return {};
      }
      throw new Error(text || "Lỗi đăng nhập không xác định");
    }
  })
  .then(data => {
    Swal.fire("Thông báo", data.message || "Đăng nhập thành công", "info");
    // TODO: Xử lý lưu session hoặc chuyển trang nếu cần
  })
  .catch(err => Swal.fire("Lỗi", err.message || "Đăng nhập thất bại", "error"));
}

function register() {
  const username = $("#reg_username").val();
  const password = $("#reg_password").val();
  const confirm = $("#reg_confirm").val();

  if (!username || !password || !confirm) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
  }
  if (password !== confirm) {
    return Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
  }

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const text = await res.text();
    try {
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || text || "Lỗi đăng ký không xác định");
      return data;
    } catch (e) {
      if (res.ok) {
        return {};
      }
      throw new Error(text || "Lỗi đăng ký không xác định");
    }
  })
  .then(data => {
    Swal.fire("Thành công", data.message || "Đăng ký thành công", "success");
    // TODO: reset form hoặc chuyển hướng nếu muốn
  })
  .catch(err => {
    Swal.fire("Lỗi", err.message || "Đăng ký thất bại", "error");
  });
}
