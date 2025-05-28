const REGISTERED_USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

// Hàm lấy danh sách người dùng đã đăng ký từ Local Storage
function getRegisteredUsers() {
  const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Failed to parse registered users from Local Storage:", e);
    return [];
  }
}

// Hàm lưu danh sách người dùng đã đăng ký vào Local Storage
function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save registered users to Local Storage:", e);
    Swal.fire("Lỗi", "Không thể lưu dữ liệu người dùng. Vui lòng kiểm tra cài đặt trình duyệt.", "error");
  }
}

// Hàm lưu thông tin người dùng đang đăng nhập vào Local Storage
function saveCurrentUser(user) {
  try {
    if (user && user.password) {
      delete user.password;
    }
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    console.log("Current user saved to local storage:", user);
  } catch (e) {
    console.error("Failed to save current user to Local Storage:", e);
    Swal.fire("Lỗi", "Không thể lưu thông tin đăng nhập. Vui lòng kiểm tra cài đặt trình duyệt.", "error");
  }
}

// Hàm xóa thông tin người dùng đang đăng nhập khỏi Local Storage
function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  console.log("Current user removed from local storage.");
}

// Hàm kiểm tra xem người dùng đã đăng nhập chưa
function checkAuthStatus() {
  const currentUserJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  try {
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    return currentUser && currentUser.username;
  } catch (e) {
    console.error("Failed to check auth status from Local Storage:", e);
    return false;
  }
}

// Hàm xử lý đăng nhập
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    Swal.fire("Lỗi", "Vui lòng nhập tên đăng nhập và mật khẩu", "error");
    return;
  }

  const registeredUsers = getRegisteredUsers();
  const foundUser = registeredUsers.find(user => user.username === username);

  if (foundUser) {
    const enteredHashedPassword = CryptoJS.SHA256(password).toString();
    if (foundUser.password === enteredHashedPassword) {
      saveCurrentUser({ username: foundUser.username });
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

// Hàm đăng xuất
function logout() {
  removeCurrentUser();
  Swal.fire("Thông báo", "Đăng xuất thành công!", "info").then(() => {
    window.location.href = 'https://genkey-ai.onrender.com/auth.html';
  });
}
