function togglePassword() {
  // This function is currently only linked to the login form's password field.
  // To make it work for the register form as well, we need to make it more general
  // or create a separate function for the register form.
  // Let's modify it to accept an event or target element to be more flexible.
  // However, the current HTML structure uses onclick directly, so let's keep it simple
  // and assume it's only for the login form as per the HTML.
  const pwd = document.querySelector('#password');
  const [view, hide] = document.querySelectorAll('#loginForm .show-pass i'); // Target icons within loginForm
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
  // Clear previous results/messages when switching forms
  $('#login_result').html('');
  $('#register_result').html('');
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  // Clear previous results/messages when switching forms
  $('#login_result').html('');
  $('#register_result').html('');
}

function login() {
  let username = $('#username').val().trim();
  let password = $('#password').val().trim();

  if (!username || !password) {
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin!', 'error');
    return;
  }

  $('#login_result').html('Đang đăng nhập...');
  // Use $.ajax for better error handling and status code checking
  $.ajax({
    url: '/api/login',
    type: 'POST',
    contentType: 'application/json', // Specify content type
    data: JSON.stringify({ username, password }), // Send data as JSON
    success: function(data) {
      // Backend sends plain text success message
      $('#login_result').html(data);
      if (data.includes('thành công')) { // Check for the specific success message
        localStorage.setItem('loggedIn', 'true');
        // Redirect after a short delay to allow user to see the success message
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500); // 0.5 second delay
      } else {
         // Handle other messages from backend (e.g., "Sai tài khoản hoặc mật khẩu", "Chưa có tài khoản nào")
         Swal.fire('Lỗi', data, 'error');
         $('#login_result').html(''); // Clear the "Đang đăng nhập..." message
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // jqXHR.responseText contains the error message from the backend
      const errorMessage = jqXHR.responseText || 'Không thể kết nối máy chủ!';
      Swal.fire('Lỗi', errorMessage, 'error');
      $('#login_result').html(''); // Clear the "Đang đăng nhập..." message
    }
  });
}

function register() {
  let username = $('#reg_username').val().trim();
  let password = $('#reg_password').val(); // Do not trim password yet, backend might handle it
  let confirm = $('#reg_confirm').val();

  if (!username || !password || !confirm) {
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin!', 'error');
    return;
  }

  if (password !== confirm) {
    Swal.fire('Lỗi', 'Mật khẩu không khớp!', 'error');
    return;
  }

  // Basic username validation (optional but good practice)
  if (username.length < 3) {
      Swal.fire('Lỗi', 'Tên đăng nhập phải có ít nhất 3 ký tự.', 'error');
      return;
  }
  // Add more validation if needed (e.g., allowed characters)

  $('#register_result').html('Đang tạo tài khoản...');
  // Use $.ajax for better error handling and status code checking
  $.ajax({
    url: '/api/register',
    type: 'POST',
    contentType: 'application/json', // Specify content type
    data: JSON.stringify({ username, password }), // Send data as JSON
    success: function(data) {
      // Backend sends plain text success message
      $('#register_result').html(data);
      if (data.includes('thành công')) { // Check for the specific success message
        Swal.fire('Thành công', 'Đăng ký thành công! Đăng nhập ngay.', 'success');
        // Clear registration fields on success
        $('#reg_username').val('');
        $('#reg_password').val('');
        $('#reg_confirm').val('');
        // Switch to login form after a short delay
        setTimeout(() => {
           showLogin();
        }, 500); // 0.5 second delay
      } else {
         // This case should ideally not happen if backend only sends "thành công" on success status 200,
         // but keeping it for robustness.
         Swal.fire('Lỗi', data, 'error');
         $('#register_result').html(''); // Clear the "Đang tạo tài khoản..." message
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // jqXHR.responseText contains the error message from the backend (e.g., "Tài khoản đã tồn tại")
      const errorMessage = jqXHR.responseText || 'Không thể kết nối máy chủ!';
      Swal.fire('Lỗi', errorMessage, 'error');
      $('#register_result').html(''); // Clear the "Đang tạo tài khoản..." message
    }
  });
}
