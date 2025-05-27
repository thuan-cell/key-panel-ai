 async function parseJSONSafe(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Failed to parse JSON:", text, e);
    return null; // Return null or throw an error depending on desired behavior
  }
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const data = await parseJSONSafe(res);
    if (!res.ok) {
      // Use the message from the server if available, otherwise a default
      const errorMessage = data?.message || `Lỗi đăng nhập (${res.status})`;
      throw new Error(errorMessage);
    }
    return data;
  })
  .then(data => {
    // Redirect to the specified page on successful login
    window.location.href = 'https://key-panel-aihtml1.onrender.com/';
    // Optional: Show a success message before redirecting, but redirection is usually immediate
    // Swal.fire("Thông báo", data?.message || "Đăng nhập thành công", "info");
  })
  .catch(err => {
    console.error("Login error:", err); // Log the error for debugging
    Swal.fire("Lỗi", err.message || "Đăng nhập thất bại", "error");
  });
}

function register() {
  // Ensure jQuery is loaded before using $
  if (typeof $ === 'undefined') {
    console.error("jQuery is not loaded.");
    Swal.fire("Lỗi", "Lỗi nội bộ: Thư viện cần thiết chưa được tải.", "error");
    return;
  }

  const username = $("#reg_username").val();
  const password = $("#reg_password").val();
  const confirm = $("#reg_confirm").val();

  if (!username || !password || !confirm) {
    return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
  }
  if (password !== confirm) {
    return Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
  }

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const data = await parseJSONSafe(res);
    if (!res.ok) {
      // Use the message from the server if available, otherwise a default
      const errorMessage = data?.message || `Lỗi đăng ký (${res.status})`;
      throw new Error(errorMessage);
    }
    return data;
  })
  .then(data => {
    Swal.fire("Thành công", data?.message || "Đăng ký thành công", "success");
    // Optional: Clear form or switch to login form on success
    // $("#reg_username").val('');
    // $("#reg_password").val('');
    // $("#reg_confirm").val('');
    // showLogin();
  })
  .catch(err => {
    console.error("Register error:", err); // Log the error for debugging
    Swal.fire("Lỗi", err.message || "Đăng ký thất bại", "error");
  });
}

// Add logout function
function logout() {
  fetch("/api/logout", {
    method: "POST", // Or GET, depending on your API
    // No body typically needed for logout
  })
  .then(async res => {
    // Attempt to parse JSON for potential error messages, but not required for success
    const data = await parseJSONSafe(res);
    if (!res.ok) {
      const errorMessage = data?.message || `Lỗi đăng xuất (${res.status})`;
      throw new Error(errorMessage);
    }
    // On successful logout, redirect to the auth page
    window.location.href = 'https://key-panel-aihtml1.onrender.com/auth.html';
    // Optional: Show a success message before redirecting
    // Swal.fire("Thông báo", data?.message || "Đăng xuất thành công", "info");
  })
  .catch(err => {
    console.error("Logout error:", err); // Log the error for debugging
    Swal.fire("Lỗi", err.message || "Đăng xuất thất bại", "error");
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