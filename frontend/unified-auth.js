
<!-- 
  The JavaScript code below is intended to be placed in 'unified-auth.js'.
  It includes the authentication logic (read/write users, check status, login, register, show forms)
  and the 'logout' function, which is called from the HTML above.
  Ensure this code is saved as 'unified-auth.js' and the corresponding script tag in the HTML <head> is uncommented.
-->

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
        // Assuming #authContainer, #loginForm, #registerForm exist elsewhere (e.g., in index.html)
        // If this file is the main entry point, these elements might not exist.
        // We'll keep the calls for consistency with the original code structure,
        // but they might not do anything if the elements aren't present.
        $('#authContainer').hide(); 
        $('#loginForm').hide(); // Ensure login/register forms are hidden
        $('#registerForm').hide();
        
        $('#keyGenTool').show();
        $('#historyToggleButton').show(); // Show history button as well
        $('#logoutBtn').show(); // Show logout button
        // You might want to display the logged-in username somewhere
        // e.g., $('#welcomeMessage').text('Xin chào, ' + loggedInUser);
        return true;
    } else {
        // User is not logged in, show auth forms, hide key gen tool
        // Assuming #authContainer, #loginForm, #registerForm exist elsewhere (e.g., in index.html)
        // If this file is the main entry point, these elements might not exist.
        // We'll keep the calls for consistency with the original code structure.
        $('#authContainer').show(); // Show the container if it exists
        $('#loginForm').show(); // Show login form by default if it exists
        $('#registerForm').hide(); // Hide register form if it exists
        
        $('#keyGenTool').hide();
        $('#historyToggleButton').hide(); // Hide history button
        $('#logoutBtn').hide(); // Hide logout button
        return false;
    }
}

// Note: login, register, showRegister, showLogin functions are assumed to be in unified-auth.js
// They are included here for completeness based on the original selection,
// but should be part of the unified-auth.js file when splitting.

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
        // Clear login form fields (assuming these inputs are in the login form)
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
      // Optional: Clear form and switch to login form on success (assuming these inputs are in the register form)
      $("#reg_username").val('');
      $("#reg_password").val('');
      $("#reg_confirm").val('');
      showLogin(); // Assuming showLogin exists and works correctly
  });
}

// Add functions to toggle between login and register forms (assuming these forms exist)
function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}

function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
}


// Function to handle logout (optional but good practice)
// This function is called directly from the HTML button via onclick="logout()"
function logout() {
    localStorage.removeItem('loggedInUser');
    Swal.fire("Thông báo", "Đã đăng xuất", "info").then(() => {
        checkLoginStatus(); // Update UI after logout
        // Optional: Redirect to login page or show login form explicitly if needed
        // showLogin(); // Uncomment if you want to explicitly show the login form after logout
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