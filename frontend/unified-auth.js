const REGISTERED_USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

function getRegisteredUsers() {
  const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Lỗi đọc danh sách người dùng:", e);
    return [];
  }
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Lỗi lưu danh sách người dùng:", e);
    Swal.fire("Lỗi", "Không thể lưu dữ liệu người dùng.", "error");
  }
}

function saveCurrentUser(user) {
  try {
    if (user && user.password) delete user.password;
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Lỗi lưu người dùng đăng nhập:", e);
    Swal.fire("Lỗi", "Không thể lưu thông tin đăng nhập.", "error");
  }
}

function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    Swal.fire("Lỗi", "Vui lòng nhập tên đăng nhập và mật khẩu", "error");
    return;
  }

  const users = getRegisteredUsers();
  const user = users.find(u => u.username === username);

  if (user) {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    if (user.password === hashedPassword) {
      saveCurrentUser({ username: user.username });
      Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
        window.location.href = 'https://genkey-ai.onrender.com/index.html';
      });
    } else {
      Swal.fire("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng", "error");
    }
  } else {
    Swal.fire("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng", "error");
  }
}

function register() {
  const username = document.getElementById("reg_username").value.trim();
  const password = document.getElementById("reg_password").value.trim();
  const confirm = document.getElementById("reg_confirm").value.trim();

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
    showLogin();
  });
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}
