function readUsersFromLocalStorage() {
  const usersJson = localStorage.getItem('users');
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Lỗi đọc dữ liệu users từ localStorage:", e);
    return [];
  }
}

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

  if (users.find(user => user.username === username)) {
    return Swal.fire("Lỗi", "Tài khoản đã tồn tại", "error");
  }

  users.push({ username, password });
  writeUsersToLocalStorage(users);

  Swal.fire("Thành công", "Đăng ký thành công", "success");

  $("#reg_username").val('');
  $("#reg_password").val('');
  $("#reg_confirm").val('');
  showLogin();
}

function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}

function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
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
    localStorage.setItem('loggedInUser', username);
    Swal.fire("Thành công", "Đăng nhập thành công", "success").then(() => {
        checkLoginStatus();
        $("#username").val('');
        $("#password").val('');
    });
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

  if (users.find(user => user.username === username)) {
    return Swal.fire("Lỗi", "Tài khoản đã tồn tại", "error");
  }

  users.push({ username, password });
  writeUsersToLocalStorage(users);

  Swal.fire("Thành công", "Đăng ký thành công", "success").then(() => {
      $("#reg_username").val('');
      $("#reg_password").val('');
      $("#reg_confirm").val('');
      showLogin();
  });
}

function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}

function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
}

function logout() {
    localStorage.removeItem('loggedInUser');
    Swal.fire("Thông báo", "Đã đăng xuất", "info").then(() => {
        checkLoginStatus();
    });
}

$(document).ready(function() {
    checkLoginStatus();
});