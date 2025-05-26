const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware parse JSON và urlencoded (form data)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hàm đọc users từ file JSON
function readUsersFromFile() {
  const filePath = path.join(__dirname, 'users.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8'); // tạo file rỗng nếu chưa tồn tại
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Hàm ghi users vào file JSON
function writeUsersToFile(users) {
  const filePath = path.join(__dirname, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

// API đăng ký
app.post('/api/register', (req, res) => {
  console.log("Body nhận được:", req.body);

  const { username, password, confirm } = req.body;

  if (!username || !password || !confirm) {
    return res.status(400).send('Vui lòng nhập đủ thông tin');
  }

  if (password !== confirm) {
    return res.status(400).send('Mật khẩu xác nhận không khớp');
  }

  const users = readUsersFromFile();

  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(409).send('Tài khoản đã tồn tại');
  }

  users.push({ username, password });
  writeUsersToFile(users);

  console.log("Đăng ký thành công:", username);
  res.status(201).send('Đăng ký thành công');
});

// API đăng nhập
app.post('/api/login', (req, res) => {
  console.log("Body login nhận được:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }

  const users = readUsersFromFile();

  const found = users.find(u => u.username === username && u.password === password);

  if (found) {
    console.log("Đăng nhập thành công:", username);
    res.status(200).send("Đăng nhập thành công");
  } else {
    res.status(401).send("Sai tài khoản hoặc mật khẩu");
  }
});

// Serve static frontend files nếu cần (nếu bạn có thư mục frontend)
// app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
