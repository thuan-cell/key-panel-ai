
// Hàm đọc danh sách người dùng từ localStorage
function readUsersFromLocalStorage() {
  const usersJson = localStorage.getItem('users');
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Lỗi đọc dữ liệu users từ localStorage:", e);
    return []; // Trả về mảng rỗng nếu dữ liệu bị lỗi
  }
}

// Hàm ghi danh sách người dùng vào localStorage
function writeUsersToLocalStorage(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (e) {
    console.error("Lỗi ghi dữ liệu users vào localStorage:", e);
    Swal.fire("Lỗi", "Không thể lưu dữ liệu người dùng trên trình duyệt của bạn.", "error");
  }
}

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // User is logged in, show key gen tool, hide auth forms
        $('#authContainer').hide();
        $('#keyGenTool').show();
        $('#historyToggleButton').show(); // Show history button as well
        $('#logoutBtn').show(); // Show logout button
        // You might want to display the logged-in username somewhere
        // e.g., $('#welcomeMessage').text('Xin chào, ' + loggedInUser);
        return true;
    } else {
        // User is not logged in, show auth forms, hide key gen tool
        $('#authContainer').show();
        $('#loginForm').show(); // Show login form by default
        $('#registerForm').hide();
        $('#keyGenTool').hide();
        $('#historyToggleButton').hide(); // Hide history button
        $('#logoutBtn').hide(); // Hide logout button
        return false;
    }
}

function login() {
  const username = $("#username").val();
  const password = $("#password").val();

  if (!username || !password) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
  }

  const users = readUsersFromLocalStorage();
  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    // Store login state (e.g., username) in localStorage
    localStorage.setItem('loggedInUser', username);
    Swal.fire("Thành công", "Đăng nhập thành công", "success").then(() => {
        // After successful login and alert, update UI
        checkLoginStatus();
        // Clear login form fields
        $("#username").val('');
        $("#password").val('');
    });
    // Removed the immediate redirection
    // window.location.href = 'https://key-panel-aihtml1.onrender.com';
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu", "error");
  }
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

  const users = readUsersFromLocalStorage();

  // Kiểm tra user đã tồn tại chưa
  if (users.find(user => user.username === username)) {
    return Swal.fire("Lỗi", "Tài khoản đã tồn tại", "error");
  }

  // Thêm user mới
  users.push({ username, password });
  writeUsersToLocalStorage(users);

  Swal.fire("Thành công", "Đăng ký thành công", "success").then(() => {
      // Optional: Clear form and switch to login form on success
      $("#reg_username").val('');
      $("#reg_password").val('');
      $("#reg_confirm").val('');
      showLogin();
  });
}

// Add functions to toggle between login and register forms
function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}

function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
}

// Function to handle logout (optional but good practice)
function logout() {
    localStorage.removeItem('loggedInUser');
    Swal.fire("Thông báo", "Đã đăng xuất", "info").then(() => {
        checkLoginStatus(); // Update UI after logout
    });
}

// Check login status when the page loads
$(document).ready(function() {
    checkLoginStatus();
    // You might also want to add event listeners for the key generation button
    // and history button here, but that's likely in genkey.js
    // For example: $('#generateBtn').on('click', generateKey);
    // Ensure generateKey function checks login status internally or relies on button disabled state
});


// Note: The backend code (express, file system operations, API endpoints)
// has been removed as per the instruction to store data on the client side.
// This setup is for demonstration/simple use cases only and is NOT secure
// for sensitive data or production environments, as data is stored unencrypted
// in the user's browser and accessible via client-side code.