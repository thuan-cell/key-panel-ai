const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USERS_FILE = path.join(__dirname, 'users.json');

function readUsersFromFile() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]', 'utf8');
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file users.json:", err);
    return [];
  }
}

function writeUsersToFile(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error("Lỗi ghi file users.json:", err);
  }
}

// Đăng ký
app.post('/api/register', (req, res) => {
  const { username, password, confirm } = req.body;

  if (!username || !password || !confirm) {
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin");
  }
  if (password !== confirm) {
    return res.status(400).send("Mật khẩu xác nhận không khớp");
  }

  let users = readUsersFromFile();

  if (users.find(u => u.username === username)) {
    return res.status(409).send("Tài khoản đã tồn tại");
  }

  users.push({ username, password });
  writeUsersToFile(users);

  res.status(201).send("Đăng ký thành công");
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Vui lòng nhập tài khoản và mật khẩu");
  }

  const users = readUsersFromFile();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    return res.status(200).send("Đăng nhập thành công");
  } else {
    return res.status(401).send("Sai tài khoản hoặc mật khẩu");
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
