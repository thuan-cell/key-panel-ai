async function parseJSONSafe(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
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
      throw new Error(data?.message || "Lỗi đăng nhập");
    }
    return data;
  })
  .then(data => {
    Swal.fire("Thông báo", data?.message || "Đăng nhập thành công", "info");
  })
  .catch(err => {
    Swal.fire("Lỗi", err.message || "Đăng nhập thất bại", "error");
  });
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
    const data = await parseJSONSafe(res);
    if (!res.ok) {
      throw new Error(data?.message || "Lỗi đăng ký");
    }
    return data;
  })
  .then(data => {
    Swal.fire("Thành công", data?.message || "Đăng ký thành công", "success");
  })
  .catch(err => {
    Swal.fire("Lỗi", err.message || "Đăng ký thất bại", "error");
  });
}
