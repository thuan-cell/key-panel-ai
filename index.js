const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
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

// ✅ Biến toàn cục quản lý quyền truy cập từ admin
let adminGranted = false;

// ✅ API kiểm tra trạng thái quyền truy cập
app.get("/api/access-status", (req, res) => {
  res.json({ admin_granted: adminGranted });
});

// ✅ Admin cấp quyền
app.post("/api/grant-access", (req, res) => {
  adminGranted = true;
  console.log("✅ Admin đã cấp quyền sử dụng");
  res.status(200).end();
});

// ✅ Admin thu hồi quyền
app.post("/api/revoke-access", (req, res) => {
  adminGranted = false;
  console.log("❌ Admin đã thu hồi quyền sử dụng");
  res.status(200).end();
});

// ====================== USERS ====================== //

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    console.error("❌ Lỗi đọc file users:", err);
    throw err;
  }
}

async function writeUsers(users) {
  const data = JSON.stringify(users, null, 2);
  try {
    await fs.writeFile(USERS_FILE, data, "utf-8");
    console.log("📝 Đã ghi file users");
  } catch (err) {
    console.error("❌ Lỗi ghi file users:", err);
    throw err;
  }
}

// Đăng ký người dùng
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

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

// Đăng nhập người dùng
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

  try {
    const users = await readUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      return res.status(200).json({ message: "Đăng nhập thành công" });
    } else {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// (Tùy chọn) API kiểm tra danh sách người dùng
app.get("/api/users", async (req, res) => {
  try {
    const users = await readUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: "Không có người dùng nào" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
});
