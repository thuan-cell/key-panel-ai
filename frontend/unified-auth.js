/**
 * Toggles the visibility of a password input field and switches the eye icons.
 * This function is designed to be reusable for multiple password fields.
 * It expects to be called from the `onclick` event of the `.show-pass` span.
 *
 * @param {Event} event The click event object.
 */
function togglePassword(event) {
  // The element that was clicked is the .show-pass span
  const showPassSpan = event.currentTarget;

  // Find the parent .input-group
  const inputGroup = showPassSpan.closest('.input-group');

  if (!inputGroup) {
    console.error("Could not find parent .input-group for password toggle.");
    return;
  }

  // Find the password input within the same input group
  const pwdInput = inputGroup.querySelector('input[type="password"], input[type="text"]');

  // Find the view and hide icons within the clicked .show-pass span
  const viewIcon = showPassSpan.querySelector('.fa-eye.view');
  const hideIcon = showPassSpan.querySelector('.fa-eye-slash.hide');

  if (!pwdInput || !viewIcon || !hideIcon) {
    console.error("Could not find password input or icons within the input group.");
    return;
  }

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    viewIcon.style.display = 'none';
    hideIcon.style.display = 'inline';
  } else {
    pwdInput.type = 'password';
    viewIcon.style.display = 'inline';
    hideIcon.style.display = 'none';
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
      // Backend sends plain text success message for login
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
    success: function(data, textStatus, jqXHR) {
      // Based on the network log, a successful registration (200 OK) might return an empty body.
      // We should assume success if the AJAX call is successful (status 2xx).
      $('#register_result').html(''); // Clear the "Đang tạo tài khoản..." message
      Swal.fire('Thành công', 'Đăng ký thành công! Đăng nhập ngay.', 'success');
      // Clear registration fields on success
      $('#reg_username').val('');
      $('#reg_password').val('');
      $('#reg_confirm').val('');
      // Switch to login form after a short delay
      setTimeout(() => {
         showLogin();
      }, 500); // 0.5 second delay
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // jqXHR.responseText contains the error message from the backend (e.g., "Tài khoản đã tồn tại")
      const errorMessage = jqXHR.responseText || 'Không thể kết nối máy chủ!';
      Swal.fire('Lỗi', errorMessage, 'error');
      $('#register_result').html(''); // Clear the "Đang tạo tài khoản..." message
    }
  });
}
