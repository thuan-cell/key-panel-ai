const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Nếu deploy trên Render thì dùng /tmp
const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER
  ? path.join("/tmp", "users.json")
  : path.join(__dirname, "users.json");

const ACCESS_FILE = IS_RENDER
  ? path.join("/tmp", "access.json")
  : path.join(__dirname, "access.json");

console.log("🔧 USERS_FILE:", USERS_FILE);
console.log("🔧 ACCESS_FILE:", ACCESS_FILE);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use("/", express.static(path.join(__dirname, "../frontend")));

// ====================== ACCESS CONTROL ====================== //

// Đọc trạng thái quyền truy cập admin
async function readAccess() {
  try {
    const data = await fs.readFile(ACCESS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { admin_granted: false };
  }
}

// Ghi trạng thái quyền admin
async function writeAccess(granted) {
  const data = JSON.stringify({ admin_granted: granted }, null, 2);
  await fs.writeFile(ACCESS_FILE, data, "utf-8");
}

// API kiểm tra quyền truy cập
app.get("/api/access-status", async (req, res) => {
  const access = await readAccess();
  res.json(access);
});

// Admin cấp quyền
app.post("/api/grant-access", async (req, res) => {
  await writeAccess(true);
  console.log("✅ Admin đã cấp quyền");
  res.sendStatus(200);
});

// Admin thu hồi quyền
app.post("/api/revoke-access", async (req, res) => {
  await writeAccess(false);
  console.log("❌ Admin đã thu hồi quyền");
  res.sendStatus(200);
});

// ====================== USERS ====================== //

// Đọc file users.json
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

// Ghi danh sách người dùng
async function writeUsers(users) {
  const data = JSON.stringify(users, null, 2);
  try {
    await fs.writeFile(USERS_FILE, data, "utf-8");
    console.log("📝 Ghi users.json thành công");
  } catch (err) {
    console.error("❌ Lỗi ghi file users:", err);
    throw err;
  }
}

// API đăng ký người dùng
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

// API đăng nhập người dùng
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

// API danh sách người dùng (nếu cần)
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

// ====================== START ====================== //

app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
});
