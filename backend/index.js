// ✅ Backend KHÔNG dùng file admin.json nữa - Lưu tạm trạng thái admin trong RAM

const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER ? path.join("/tmp", "users.json") : path.join(__dirname, "users.json");

console.log("\ud83d\udd27 USERS_FILE:", USERS_FILE);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../frontend")));

// === Biến RAM lưu tạm trạng thái admin ===
let adminGranted = false;

// === Đọc / ghi user ===
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    console.error("\u274c Lỗi đọc user:", err);
    throw err;
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("\u274c Lỗi ghi user:", err);
    throw err;
  }
}

// === API ===
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

app.get("/api/users", async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// === Quản lý trạng thái admin ===
app.post("/api/grant-access", (req, res) => {
  adminGranted = true;
  console.log("\u2705 Admin đã cấp quyền");
  res.status(200).json({ success: true });
});

app.post("/api/revoke-access", (req, res) => {
  adminGranted = false;
  console.log("\u274c Admin đã thu hồi quyền");
  res.status(200).json({ success: true });
});

app.get("/api/access-status", (req, res) => {
  res.status(200).json({ admin_granted: adminGranted });
});

app.listen(PORT, () => {
  console.log(`\ud83c\udf10 Server chạy: http://localhost:${PORT}`);
});
