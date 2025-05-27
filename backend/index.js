const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER
  ? path.join("/tmp", "users.json")
  : path.join(__dirname, "users.json");

console.log("🔧 USERS_FILE:", USERS_FILE);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "../frontend")));

app.post("/api/register", (req, res) => {
  console.log("📩 Dữ liệu nhận từ client:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    } catch (err) {
      console.error("❌ Lỗi đọc file:", err);
      return res.status(500).send("Lỗi đọc dữ liệu người dùng");
    }
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).send("Tài khoản đã tồn tại");
  }

  users.push({ username, password });

  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("✅ Đăng ký thành công:", username);
    res.send("Đăng ký thành công");
  } catch (err) {
    console.error("❌ Lỗi ghi file:", err);
    res.status(500).send("Lỗi khi lưu tài khoản");
  }
});

app.post("/api/login", (req, res) => {
  console.log("📩 Dữ liệu login nhận được:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }

  if (!fs.existsSync(USERS_FILE)) {
    return res.status(404).send("Chưa có tài khoản nào");
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const found = users.find(u => u.username === username && u.password === password);

    if (found) {
      res.send("Đăng nhập thành công");
    } else {
      res.status(401).send("Sai tài khoản hoặc mật khẩu");
    }
  } catch (err) {
    console.error("❌ Lỗi đọc file:", err);
    res.status(500).send("Lỗi hệ thống");
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
});
