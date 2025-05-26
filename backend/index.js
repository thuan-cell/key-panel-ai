const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 Sửa: Lưu file người dùng trong thư mục tạm (Render cho phép ghi ở /tmp)
const USERS_FILE = path.join("/tmp", "users.json");

app.use(cors());
app.use(express.json());

// ✅ Serve file tĩnh (HTML, JS...) từ thư mục frontend/
app.use('/', express.static(path.join(__dirname, '../frontend')));

// API giả lập số dư
app.get("/balance", (req, res) => {
  const balance = 85000;
  res.json({ balance });
});

// Đăng ký
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  let users = [];

  // Nếu file đã tồn tại → đọc danh sách
  if (fs.existsSync(USERS_FILE)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_FILE));
    } catch (err) {
      console.error("❌ Lỗi đọc file:", err);
      users = [];
    }
  }

  // Kiểm tra trùng username
  if (users.find(u => u.username === username)) {
    res.setHeader("Content-Type", "text/plain");
    return res.send("Tài khoản đã tồn tại");
  }

  // Thêm tài khoản mới
  users.push({ username, password });

  // Ghi lại file mới vào /tmp
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("✅ Đã ghi file users.json thành công.");
    res.setHeader("Content-Type", "text/plain");
    res.send("Đăng ký thành công");
  } catch (err) {
    console.error("❌ Lỗi ghi file:", err);
    res.status(500).send("Lỗi hệ thống khi lưu tài khoản");
  }
});

// Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    res.setHeader("Content-Type", "text/plain");
    return res.send("Chưa có tài khoản nào");
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  } catch (err) {
    console.error("❌ Lỗi đọc file khi đăng nhập:", err);
    res.setHeader("Content-Type", "text/plain");
    return res.send("Lỗi hệ thống");
  }

  const user = users.find(u => u.username === username && u.password === password);

  res.setHeader("Content-Type", "text/plain");
  if (user) {
    res.send("Đăng nhập thành công");
  } else {
    res.send("Sai tài khoản hoặc mật khẩu");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
