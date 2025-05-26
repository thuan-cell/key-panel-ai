const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const usersFile = path.join(__dirname, 'users.json');

// Đọc users từ file, trả về object
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Ghi users vào file
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Đăng ký user mới
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).send('Vui lòng nhập đầy đủ thông tin');
  }

  const users = readUsers();

  if(users[username]) {
    return res.status(409).send('Tài khoản đã tồn tại');
  }

  const hash = bcrypt.hashSync(password, 10);
  users[username] = { password: hash };

  writeUsers(users);
  res.status(200).send('Đăng ký thành công');
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).send('Vui lòng nhập đầy đủ thông tin');
  }

  const users = readUsers();
  if(!users[username]) {
    return res.status(401).send('Tài khoản không tồn tại');
  }

  const isValid = bcrypt.compareSync(password, users[username].password);
  if(!isValid) {
    return res.status(401).send('Mật khẩu không đúng');
  }

  res.status(200).send('Đăng nhập thành công');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
