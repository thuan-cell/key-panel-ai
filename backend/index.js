const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER ? path.join("/tmp", "users.json") : path.join(__dirname, "users.json");
const ADMIN_FILE = IS_RENDER ? path.join("/tmp", "admin.json") : path.join(__dirname, "admin.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../frontend")));

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

async function writeAdminStatus(status) {
  await fs.writeFile(ADMIN_FILE, JSON.stringify({ admin_granted: status }), "utf-8");
}

async function readAdminStatus() {
  try {
    const data = await fs.readFile(ADMIN_FILE, "utf-8");
    return JSON.parse(data).admin_granted === true;
  } catch {
    return false;
  }
}

// API người dùng
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Thiếu thông tin" });

  const users = await readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Tài khoản đã tồn tại" });
  }
  users.push({ username, password });
  await writeUsers(users);
  res.status(200).json({ message: "Đăng ký thành công" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Thiếu thông tin" });

  const users = await readUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if (found) return res.status(200).json({ message: "Đăng nhập thành công" });
  res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
});

app.get("/api/users", async (req, res) => {
  const users = await readUsers();
  res.json(users);
});

// Quản lý quyền admin
app.post("/api/grant-access", async (req, res) => {
  await writeAdminStatus(true);
  res.status(200).json({ success: true });
});

app.post("/api/revoke-access", async (req, res) => {
  await writeAdminStatus(false);
  res.status(200).json({ success: true });
});

app.get("/api/access-status", async (req, res) => {
  const granted = await readAdminStatus();
  res.status(200).json({ admin_granted: granted });
});

app.listen(PORT, () => {
  console.log(`🌐 Server chạy tại http://localhost:${PORT}`);
});
