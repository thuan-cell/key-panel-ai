const REGISTERED_USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';
const ADMIN_GRANTED_KEY = 'admin_granted';

function getRegisteredUsers() {
  try {
    const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("❌ Lỗi khi đọc người dùng:", e);
    return [];
  }
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    Swal.fire("Lỗi", "Không thể lưu người dùng", "error");
  }
}

function saveCurrentUser(user) {
  if (user && user.password) delete user.password;
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

function checkAuthStatus() {
  try {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_STORAGE_KEY));
    return currentUser && currentUser.username;
  } catch {
    return false;
  }
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = getRegisteredUsers();
  const user = users.find(u => u.username === username);
  const hashed = CryptoJS.SHA256(password).toString();

  if (user && user.password === hashed) {
    saveCurrentUser({ username: user.username });
    Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
      window.location.href = "/index.html";
    });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu", "error");
  }
}

function register() {
  const username = $("#reg_username").val().trim();
  const password = $("#reg_password").val().trim();
  const confirm = $("#reg_confirm").val().trim();

  if (!username || !password || !confirm || password !== confirm) {
    Swal.fire("Lỗi", "Thông tin không hợp lệ", "error");
    return;
  }

  const users = getRegisteredUsers();
  if (users.find(u => u.username === username)) {
    Swal.fire("Lỗi", "Tên đăng nhập đã tồn tại", "error");
    return;
  }

  const hashed = CryptoJS.SHA256(password).toString();
  users.push({ username, password: hashed });
  saveRegisteredUsers(users);

  Swal.fire("Thành công", "Đăng ký thành công!", "success").then(showLogin);
}

function logout() {
  removeCurrentUser();
  localStorage.removeItem(ADMIN_GRANTED_KEY);
  Swal.fire("Thông báo", "Đã đăng xuất", "info").then(() => {
    window.location.href = "/auth.html";
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

async function checkAdminAccess() {
  try {
    const res = await fetch("/api/access-status");
    const data = await res.json();
    const granted = !!data.admin_granted;
    localStorage.setItem(ADMIN_GRANTED_KEY, granted ? "true" : "false");
    return granted;
  } catch (e) {
    localStorage.setItem(ADMIN_GRANTED_KEY, "false");
    return false;
  }
}
