const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER ? path.join("/tmp", "users.json") : path.join(__dirname, "users.json");
const ADMIN_STATUS_FILE = IS_RENDER ? path.join("/tmp", "admin.json") : path.join(__dirname, "admin.json");

console.log("🔧 USERS_FILE:", USERS_FILE);
console.log("🔧 ADMIN_STATUS_FILE:", ADMIN_STATUS_FILE);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../frontend")));

// Đọc user
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    console.error("❌ Lỗi đọc user:", err);
    throw err;
  }
}

// Ghi user
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Lỗi ghi user:", err);
    throw err;
  }
}

// Đọc trạng thái admin
async function getAdminStatus() {
  try {
    const data = await fs.readFile(ADMIN_STATUS_FILE, "utf-8");
    const json = JSON.parse(data);
    return !!json.admin_granted;
  } catch {
    return false;
  }
}

// ✅ Đăng ký
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Thiếu username hoặc password" });

  try {
    const users = await readUsers();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    users.push({ username, password });
    await writeUsers(users);
    return res.status(200).json({ message: "Đăng ký thành công" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// ✅ Đăng nhập
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Thiếu username hoặc password" });

  try {
    const users = await readUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) return res.status(200).json({ message: "Đăng nhập thành công" });
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  } catch {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// ✅ Danh sách user (không nên public trong bản chính thức)
app.get("/api/users", async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// ✅ Cấp quyền admin
app.post("/api/grant-access", async (req, res) => {
  try {
    await fs.writeFile(ADMIN_STATUS_FILE, JSON.stringify({ admin_granted: true }), "utf-8");
    res.status(200).json({ success: true, message: "Đã cấp quyền truy cập" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi ghi quyền admin" });
  }
});

// ✅ Thu hồi quyền admin
app.post("/api/revoke-access", async (req, res) => {
  try {
    await fs.writeFile(ADMIN_STATUS_FILE, JSON.stringify({ admin_granted: false }), "utf-8");
    res.status(200).json({ success: true, message: "Đã thu hồi quyền truy cập" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi thu hồi quyền admin" });
  }
});

// ✅ Trạng thái quyền
app.get("/api/access-status", async (req, res) => {
  const granted = await getAdminStatus();
  res.status(200).json({ admin_granted: granted });
});

app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});
