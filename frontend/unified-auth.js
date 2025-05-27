const API_BASE = ""; // Render: tự động theo domain

function showRegister() {
  $('#loginForm').hide();
  $('#registerForm').show();
}

function showLogin() {
  $('#registerForm').hide();
  $('#loginForm').show();
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.text())
  .then(data => {
    Swal.fire("Thông báo", data, "info");
    // xử lý chuyển trang hoặc lưu session tại đây nếu cần
  })
  .catch(err => Swal.fire("Lỗi", "Đăng nhập thất bại", "error"));
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

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Lỗi không xác định");
      }
      return res.json(); // server trả { message: "Đăng ký thành công" }
    })
    .then(data => {
      Swal.fire("Thành công", data.message || "Đăng ký thành công", "success");
      // Có thể reset form hoặc chuyển hướng ở đây nếu muốn
    })
    .catch(err => {
      Swal.fire("Lỗi", err.message || "Đăng ký thất bại", "error");
    });
}
