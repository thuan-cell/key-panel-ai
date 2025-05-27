const API_BASE = ""; // "" = tự động theo domain, hoặc thay bằng: "https://your-app.onrender.com"

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function login() {
  let username = $('#username').val().trim();
  let password = $('#password').val().trim();
  if (!username || !password) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ!", "error");
  }

  $.post(`${API_BASE}/api/login`, { username, password })
    .done(data => Swal.fire("OK", data, "success"))
    .fail(xhr => Swal.fire("Lỗi", xhr.responseText || "Lỗi đăng nhập", "error"));
}

function register() {
  let username = $('#reg_username').val().trim();
  let password = $('#reg_password').val();
  let confirm = $('#reg_confirm').val();

  if (!username || !password || !confirm) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ!", "error");
  }

  if (password !== confirm) {
    return Swal.fire("Lỗi", "Mật khẩu không khớp!", "error");
  }

  $.post(`${API_BASE}/api/register`, { username, password })
    .done(data => {
      Swal.fire("Thành công", data, "success");
      showLogin();
    })
    .fail(xhr => Swal.fire("Lỗi", xhr.responseText || "Lỗi đăng ký", "error"));
}
