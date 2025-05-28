const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// File user tạm
const USERS_FILE = process.env.RENDER === "true"
  ? path.join("/tmp", "users.json")
  : path.join(__dirname, "users.json");

let adminGranted = false; // ✅ Biến toàn cục lưu quyền admin

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../frontend")));

// ----- XỬ LÝ FILE USERS -----
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// ----- API NGƯỜI DÙNG -----
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Thiếu thông tin" });

  try {
    const users = await readUsers();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    users.push({ username, password });
    await writeUsers(users);
    res.status(200).json({ message: "Đăng ký thành công" });
  } catch {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Thiếu thông tin" });

  try {
    const users = await readUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) return res.status(200).json({ message: "Đăng nhập thành công" });
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  } catch {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// ----- QUẢN LÝ QUYỀN ADMIN -----
app.post("/api/grant-access", (req, res) => {
  adminGranted = true;
  res.status(200).json({ success: true });
});

app.post("/api/revoke-access", (req, res) => {
  adminGranted = false;
  res.status(200).json({ success: true });
});

app.get("/api/access-status", (req, res) => {
  res.status(200).json({ admin_granted: adminGranted });
});

// ----- LẤY USERS (tùy chọn) -----
app.get("/api/users", async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// ----- START -----
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
