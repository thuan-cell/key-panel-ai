function togglePassword() {
  const pwd = document.querySelector('#password');
  const [view, hide] = document.querySelectorAll('.show-pass i');
  if (pwd.type === 'password') {
    pwd.type = 'text';
    view.style.display = 'none';
    hide.style.display = 'inline';
  } else {
    pwd.type = 'password';
    view.style.display = 'inline';
    hide.style.display = 'none';
  }
}

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
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin!', 'error');
    return;
  }

  $('#login_result').html('Đang đăng nhập...');
  $.post('/api/login', { username, password }, function(data) {
    $('#login_result').html(data);
    if (data.includes('thành công') || data.includes('success')) {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'index.html';
    }
  }).fail(() => {
    Swal.fire('Lỗi', 'Không thể kết nối máy chủ!', 'error');
  });
}

function register() {
  let username = $('#reg_username').val().trim();
  let password = $('#reg_password').val();
  let confirm = $('#reg_confirm').val();

  if (!username || !password || !confirm) {
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin!', 'error');
    return;
  }

  if (password !== confirm) {
    Swal.fire('Lỗi', 'Mật khẩu không khớp!', 'error');
    return;
  }

  $('#register_result').html('Đang tạo tài khoản...');
  $.post('/api/register', { username, password }, function(data) {
    $('#register_result').html(data);
    if (data.includes('thành công') || data.includes('success')) {
      Swal.fire('Thành công', 'Đăng ký thành công! Đăng nhập ngay.', 'success');
      showLogin();
    }
  }).fail(() => {
    Swal.fire('Lỗi', 'Không thể kết nối máy chủ!', 'error');
  });
}
