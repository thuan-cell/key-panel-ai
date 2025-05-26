const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

app.use(cors());
app.use(express.json());

// ✅ Thêm dòng này để serve file HTML từ frontend/
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
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.find(u => u.username === username)) {
    return res.send("Tài khoản đã tồn tại");
  }

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.send("Đăng ký thành công");
});

// Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.send("Chưa có tài khoản nào");
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send("Đăng nhập thành công");
  } else {
    res.send("Sai tài khoản hoặc mật khẩu");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
