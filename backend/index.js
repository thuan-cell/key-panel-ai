const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Nếu bạn deploy trên Render hoặc môi trường có biến RENDER=true thì dùng /tmp
const IS_RENDER = process.env.RENDER === "true";
const USERS_FILE = IS_RENDER
  ? path.join("/tmp", "users.json")
  : path.join(__dirname, "users.json");

console.log("🔧 USERS_FILE:", USERS_FILE);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nếu bạn có frontend, đổi đường dẫn phù hợp hoặc bỏ nếu không dùng
app.use("/", express.static(path.join(__dirname, "../frontend")));

// Đọc file users.json, trả về array user hoặc [] nếu chưa có file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      // File chưa tồn tại thì trả về mảng rỗng
      return [];
    }
    console.error("❌ Lỗi đọc file users:", err);
    throw err;
  }
}

// Ghi mảng users vào file
async function writeUsers(users) {
  const data = JSON.stringify(users, null, 2);
  try {
    await fs.writeFile(USERS_FILE, data, "utf-8");
    console.log("📝 Ghi file users thành công");
  } catch (err) {
    console.error("❌ Lỗi ghi file users:", err);
    throw err;
  }
}

// API đăng ký user
app.post("/api/register", async (req, res) => {
  console.log("📩 Dữ liệu nhận từ client:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("❌ Thiếu username hoặc password");
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

  try {
    const users = await readUsers();
    console.log("📁 Danh sách users hiện tại:", users);

    // Kiểm tra user đã tồn tại chưa
    if (users.find(u => u.username === username)) {
      console.log("⚠️ Tài khoản đã tồn tại:", username);
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    users.push({ username, password });
    console.log("➕ Đã thêm:", { username, password });

    await writeUsers(users);

    console.log("✅ Đăng ký thành công:", username);
    return res.status(200).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xử lý đăng ký:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// API đăng nhập
app.post("/api/login", async (req, res) => {
  console.log("📩 Dữ liệu login nhận được:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

  try {
    const users = await readUsers();

    if (users.length === 0) {
      return res.status(404).json({ message: "Chưa có tài khoản nào" });
    }

    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      return res.status(200).json({ message: "Đăng nhập thành công" });
    } else {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (err) {
    console.error("❌ Lỗi đọc dữ liệu đăng nhập:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// API lấy danh sách user (dùng để kiểm tra, không nên public nếu web thật)
app.get("/api/users", async (req, res) => {
  try {
    const users = await readUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: "Không có người dùng nào" });
    }
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi đọc danh sách user:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
});
