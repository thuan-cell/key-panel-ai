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

function login() {
  const username = $("#username").val();
  const password = $("#password").val();

  if (!username || !password) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
  }

  const users = readUsersFromLocalStorage();
  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    Swal.fire("Thành công", "Đăng nhập thành công", "success");
    // Optional: Redirect or perform action after successful login
    // window.location.href = '/dashboard';
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu", "error");
  }
  window.location.href = 'https://key-panel-aihtml1.onrender.com';
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

  Swal.fire("Thành công", "Đăng ký thành công", "success");

  // Optional: Clear form and switch to login form on success
  $("#reg_username").val('');
  $("#reg_password").val('');
  $("#reg_confirm").val('');
  showLogin();
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

// Note: The backend code (express, file system operations, API endpoints)
// has been removed as per the instruction to store data on the client side.
// This setup is for demonstration/simple use cases only and is NOT secure
// for sensitive data or production environments, as data is stored unencrypted
// in the user's browser and accessible via client-side code.