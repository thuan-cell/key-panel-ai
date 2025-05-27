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
  const username = $('#username').val().trim();
  const password = $('#password').val().trim();

  if (!username || !password) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
  }

  $.post(`${API_BASE}/api/login`, { username, password })
    .done(data => Swal.fire("✅ Thành công", data, "success"))
    .fail(xhr => Swal.fire("❌ Lỗi", xhr.responseText || "Lỗi đăng nhập", "error"));
}

function register() {
  const username = document.getElementById("reg_username").value;
  const password = document.getElementById("reg_password").value;
  const confirm = document.getElementById("reg_confirm").value;

  if (!username || !password || !confirm) {
    Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
    return;
  }

  if (password !== confirm) {
    Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
    return;
  }

  // Gửi POST với content-type: application/json
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.text())
  .then(data => {
    Swal.fire("Thành công", data, "success");
    showLogin();
  })
  .catch(err => Swal.fire("Lỗi", "Đăng ký thất bại", "error"));
}
