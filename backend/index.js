function login() {
  let username = $('#username').val().trim();
  let password = $('#password').val().trim();

  if (!username) {
    Swal.fire('Thông báo', 'Vui lòng nhập tài khoản!', 'error');
    return false;
  } else if (!password) {
    Swal.fire('Thông báo', 'Vui lòng nhập mật khẩu!', 'error');
    return false;
  }

  $('#login').html("<i class='fa fa-spinner fa-spin'></i> Đang đăng nhập...").attr('disabled', 'disabled');

  $.post('../progress/auth/login.php', { username: username, password: password }, function(data) {
    $('#login').html("Đăng nhập").removeAttr('disabled');
    $('#login_result').html(data);

    // Nếu có từ khóa thành công => login thành công
    if (data.includes("thành công") || data.includes("success")) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html"; // 👉 chuyển sang trang tạo key
    }
  });
}
