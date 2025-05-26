const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 💡 Kiểm tra môi trường đang chạy ở Render hay local
const IS_RENDER = process.env.RENDER === "true";
// Sử dụng thư mục tạm /tmp trên Render cho dữ liệu không cần lưu trữ lâu dài
// Sử dụng thư mục hiện tại (__dirname) cho local
const USERS_FILE = IS_RENDER
  ? path.join("/tmp", "users.json")
  : path.join(__dirname, "users.json");

console.log("🔧 USERS_FILE:", USERS_FILE);

// 📦 Middleware xử lý JSON & form x-www-form-urlencoded
app.use(cors());
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

// ✅ Serve frontend tĩnh
app.use("/", express.static(path.join(__dirname, "../frontend")));

// 📌 API giả lập số dư tài khoản
app.get("/balance", (req, res) => {
  res.json({ balance: 85000 });
});

// Hàm đọc dữ liệu người dùng từ file
const readUsersFromFile = () => {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      // Kiểm tra nếu file rỗng hoặc không hợp lệ
      if (!data.trim()) {
        console.warn("⚠️ File người dùng rỗng hoặc chỉ chứa khoảng trắng. Trả về mảng rỗng.");
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("❌ Lỗi đọc file người dùng:", err);
      // Trả về mảng rỗng nếu có lỗi đọc file để tránh crash
      return [];
    }
  }
  // Trả về mảng rỗng nếu file không tồn tại
  return [];
};

// Hàm ghi dữ liệu người dùng vào file
const writeUsersToFile = (users) => {
  try {
    // Đảm bảo thư mục tồn tại trước khi ghi (chủ yếu hữu ích nếu path phức tạp hơn /tmp hoặc __dirname)
    // const dir = path.dirname(USERS_FILE);
    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir, { recursive: true });
    // }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    console.log("✅ Dữ liệu người dùng đã được lưu vào:", USERS_FILE);
  } catch (err) {
    console.error("❌ Lỗi ghi file người dùng:", err);
    // Ném lỗi để hàm gọi có thể xử lý
    throw err;
  }
};


// 📌 API: Đăng ký tài khoản
app.post("/api/register", (req, res) => {
  console.log("📩 Dữ liệu đăng ký nhận từ client:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }

  let users = readUsersFromFile();

  if (users.find(u => u.username === username)) {
    console.warn(`⚠️ Đăng ký thất bại: Tài khoản "${username}" đã tồn tại.`);
    return res.status(400).send("Tài khoản đã tồn tại");
  }

  users.push({ username, password });

  try {
    writeUsersToFile(users);
    console.log("✅ Đăng ký thành công:", username);
    // Changed to send status 200 with empty body to match the request dump
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Đăng ký thất bại: Lỗi khi lưu tài khoản:", err);
    res.status(500).send("Lỗi khi lưu tài khoản");
  }
});

// 📌 API: Đăng nhập
app.post("/api/login", (req, res) => {
  console.log("📩 Dữ liệu login nhận được:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }

  const users = readUsersFromFile();

  if (users.length === 0) {
     console.warn("⚠️ Đăng nhập thất bại: Chưa có tài khoản nào được đăng ký.");
     return res.status(404).send("Chưa có tài khoản nào");
  }

  const found = users.find(u => u.username === username && u.password === password);

  if (found) {
    console.log("✅ Đăng nhập thành công:", username);
    res.status(200).send("Đăng nhập thành công"); // Trả về status 200 cho thành công
  } else {
    console.warn(`⚠️ Đăng nhập thất bại: Sai tài khoản hoặc mật khẩu cho "${username}".`);
    res.status(401).send("Sai tài khoản hoặc mật khẩu");
  }
});

// 🚀 Khởi động server
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📂 File người dùng đang sử dụng: ${USERS_FILE}`);
  if (IS_RENDER) {
      console.log("⚠️ Lưu ý: Đang chạy trên Render, dữ liệu trong /tmp sẽ bị mất khi container khởi động lại.");
  }
});
