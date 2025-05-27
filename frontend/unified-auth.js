
const REGISTERED_USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

// Hàm lấy danh sách người dùng đã đăng ký từ Local Storage
function getRegisteredUsers() {
  const usersJson = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
  try {
    // Trả về mảng rỗng nếu không có dữ liệu hoặc dữ liệu không hợp lệ
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Failed to parse registered users from Local Storage:", e);
    // Trả về mảng rỗng nếu có lỗi khi parse
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

// Hàm kiểm tra xem người dùng đã đăng nhập chưa bằng cách kiểm tra Local Storage
function checkAuthStatus() {
  const currentUserJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  try {
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    // Kiểm tra xem currentUser có tồn tại và có thuộc tính username không
    if (currentUser && currentUser.username) {
      console.log("User logged in:", currentUser.username);
      return true;
    } else {
      console.log("No user logged in.");
      return false;
    }
  } catch (e) {
    console.error("Failed to check auth status from Local Storage:", e);
    // Trả về false nếu có lỗi khi parse
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

  // Tìm người dùng theo tên đăng nhập
  const foundUser = registeredUsers.find(user => user.username === username);

  if (foundUser) {
    // Mã hóa mật khẩu người dùng nhập vào để so sánh với mật khẩu đã lưu
    const enteredHashedPassword = CryptoJS.SHA256(password).toString();

    // So sánh mật khẩu đã mã hóa
    if (foundUser.password === enteredHashedPassword) {
      // Lưu thông tin người dùng đang đăng nhập
      saveCurrentUser({ username: foundUser.username });
      Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
        // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        window.location.href = 'https://key-panel-aihtml1.onrender.com/';
      });
    } else {
      // Mật khẩu không khớp
      Swal.fire("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng", "error");
    }
  } else {
    // Không tìm thấy người dùng
    Swal.fire("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng", "error");
  }
}

// Hàm xử lý đăng ký
function register() {
  // Kiểm tra jQuery đã tải chưa (đảm bảo các selector $ hoạt động)
  if (typeof $ === 'undefined') {
    console.error("jQuery is not loaded.");
    Swal.fire("Lỗi", "Lỗi nội bộ: Thư viện cần thiết chưa được tải.", "error");
    return;
  }
  // Kiểm tra Crypto-JS đã tải chưa
  if (typeof CryptoJS === 'undefined') {
      console.error("CryptoJS is not loaded.");
      Swal.fire("Lỗi", "Lỗi nội bộ: Thư viện mã hóa chưa được tải.", "error");
      return;
  }


  const username = $("#reg_username").val().trim();
  const password = $("#reg_password").val().trim();
  const confirm = $("#reg_confirm").val().trim();

  if (!username || !password || !confirm) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
  }
  if (password !== confirm) {
    return Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
  }

  const registeredUsers = getRegisteredUsers();

  // Kiểm tra tên đăng nhập đã tồn tại chưa
  const userExists = registeredUsers.some(user => user.username === username);

  if (userExists) {
    Swal.fire("Lỗi", "Tên đăng nhập đã tồn tại", "error");
  } else {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Tạo người dùng mới với mật khẩu đã mã hóa và lưu vào Local Storage
    const newUser = { username, password: hashedPassword };
    registeredUsers.push(newUser);
    saveRegisteredUsers(registeredUsers);

    Swal.fire("Thành công", "Đăng ký thành công!", "success").then(() => {
      // Xóa dữ liệu trên form đăng ký và chuyển về form đăng nhập
      $("#reg_username").val('');
      $("#reg_password").val('');
      $("#reg_confirm").val('');
      showLogin();
    });
  }
}

// Hàm đăng xuất
function logout() {
  removeCurrentUser();
  Swal.fire("Thông báo", "Đăng xuất thành công!", "info").then(() => {
    // Chuyển hướng về trang đăng nhập/đăng ký sau khi đăng xuất
    window.location.href = 'https://key-panel-aihtml1.onrender.com/auth.html';
  });
}

// Hàm hiển thị form đăng ký
function showRegister() {
  $("#loginForm").hide();
  $("#registerForm").show();
}

// Hàm hiển thị form đăng nhập
function showLogin() {
  $("#registerForm").hide();
  $("#loginForm").show();
}

// Khi trang tải xong, kiểm tra trạng thái đăng nhập
$(document).ready(function() {
  // Lý do thông báo "Đã đăng nhập" hiện lại liên tục là vì khi người dùng đã đăng nhập
  // và ở lại trang auth.html (thay vì chuyển hướng đi), mỗi lần trang được tải lại
  // hoặc truy cập lại, hàm checkAuthStatus() vẫn trả về true và hiển thị lại thông báo.
  // Để khắc phục, nếu người dùng đã đăng nhập, chúng ta nên tự động chuyển hướng họ
  // đến trang chính thay vì hiển thị thông báo hỏi.
  if (checkAuthStatus()) {
    console.log("User already logged in. Redirecting to main page.");
    // Nếu đã đăng nhập, chuyển hướng ngay lập tức đến trang chính
    window.location.href = 'https://key-panel-aihtml1.onrender.com/';
  } else {
    console.log("User not logged in. Showing authentication forms.");
    // Nếu chưa đăng nhập, giữ nguyên trang để hiển thị form đăng nhập/đăng ký
    // (Không cần làm gì thêm ở đây vì form mặc định là loginForm)
  }
});