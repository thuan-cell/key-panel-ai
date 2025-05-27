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
  const username = $('#reg_username').val().trim();
  const password = $('#reg_password').val();
  const confirm = $('#reg_confirm').val();

  if (!username || !password || !confirm) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
  }

  if (password !== confirm) {
    return Swal.fire("Lỗi", "Mật khẩu không khớp!", "error");
  }

  $.post(`${API_BASE}/api/register`, { username, password })
    .done(data => {
      Swal.fire("✅ Thành công", data, "success");
      showLogin();
    })
    .fail(xhr => Swal.fire("❌ Lỗi", xhr.responseText || "Lỗi đăng ký", "error"));
}
