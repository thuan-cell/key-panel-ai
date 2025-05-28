const REGISTERED_USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';
const ADMIN_GRANTED_KEY = 'admin_granted';

// Lấy danh sách người dùng từ Local Storage
function getRegisteredUsers() {
  try {
    const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("❌ Lỗi khi đọc người dùng từ Local Storage:", e);
    return [];
  }
}

// Lưu danh sách người dùng vào Local Storage
function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("❌ Không thể lưu người dùng:", e);
    Swal.fire("Lỗi", "Không thể lưu danh sách người dùng.", "error");
  }
}

// Lưu người dùng đang đăng nhập
function saveCurrentUser(user) {
  try {
    if (user && user.password) delete user.password;
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("❌ Không thể lưu thông tin đăng nhập:", e);
    Swal.fire("Lỗi", "Không thể lưu thông tin đăng nhập.", "error");
  }
}

// Xoá thông tin người dùng đăng nhập
function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

// Kiểm tra trạng thái đăng nhập
function checkAuthStatus() {
  try {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_STORAGE_KEY));
    return currentUser && currentUser.username;
  } catch {
    return false;
  }
}

// Đăng nhập
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    Swal.fire("Lỗi", "Vui lòng nhập tên đăng nhập và mật khẩu", "error");
    return;
  }

  const users = getRegisteredUsers();
  const user = users.find(u => u.username === username);
  const hashed = CryptoJS.SHA256(password).toString();

  if (user && user.password === hashed) {
    saveCurrentUser({ username: user.username });
    Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
      window.location.href = '/index.html';
    });
  } else {
    Swal.fire("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng", "error");
  }
}

// Đăng ký
function register() {
  if (typeof $ === 'undefined' || typeof CryptoJS === 'undefined') {
    Swal.fire("Lỗi", "Thư viện cần thiết chưa được tải", "error");
    return;
  }

  const username = $("#reg_username").val().trim();
  const password = $("#reg_password").val().trim();
  const confirm = $("#reg_confirm").val().trim();

  if (!username || !password || !confirm) {
    Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
    return;
  }

  if (password !== confirm) {
    Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
    return;
  }

  const users = getRegisteredUsers();
  if (users.find(u => u.username === username)) {
    Swal.fire("Lỗi", "Tên đăng nhập đã tồn tại", "error");
    return;
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();
  users.push({ username, password: hashedPassword });
  saveRegisteredUsers(users);

  Swal.fire("Thành công", "Đăng ký thành công!", "success").then(() => {
    $("#reg_username, #reg_password, #reg_confirm").val('');
    showLogin();
  });
}

// Đăng xuất
function logout() {
  removeCurrentUser();
  localStorage.removeItem(ADMIN_GRANTED_KEY);
  Swal.fire("Thông báo", "Đăng xuất thành công!", "info").then(() => {
    window.location.href = '/auth.html';
  });
}

// Hiển thị form
function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}
function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
}

// 🔐 Kiểm tra quyền admin → lưu localStorage
async function checkAdminAccess() {
  try {
    const res = await fetch("/api/access-status");
    if (!res.ok) throw new Error("Lỗi truy vấn server");
    const data = await res.json();

    const granted = !!data.admin_granted;
    localStorage.setItem(ADMIN_GRANTED_KEY, granted ? "true" : "false");
    return granted;
  } catch (e) {
    console.error("❌ Lỗi kiểm tra quyền admin:", e);
    localStorage.setItem(ADMIN_GRANTED_KEY, "false");
    return false;
  }
}
