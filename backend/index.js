const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function readUsersFromFile() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file users.json:", err);
    return [];
  }
}

app.post('/api/login', (req, res) => {
  console.log("📩 Dữ liệu login nhận được:", req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Thiếu username hoặc password");
  }
  const users = readUsersFromFile();
  if (users.length === 0) {
    return res.status(404).send("Chưa có tài khoản nào");
  }
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    return res.status(200).send("Đăng nhập thành công");
  } else {
    return res.status(401).send("Sai tài khoản hoặc mật khẩu");
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
