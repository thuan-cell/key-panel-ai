const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://donnawalkeru3voulgj:hsdRJsngrGVi6ZVu@cluster0.xxxxx.mongodb.net/myapp?retryWrites=true&w=majority&appName=AtlasApp'; // ❗ sửa lại phần xxx

// Kết nối MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Định nghĩa schema người dùng
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../frontend'));

// API đăng ký
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Thiếu thông tin');

  const existed = await User.findOne({ username });
  if (existed) return res.status(409).send('Tài khoản đã tồn tại');

  await User.create({ username, password });
  res.send('Đăng ký thành công');
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).send('Sai tài khoản hoặc mật khẩu');

  res.send('Đăng nhập thành công');
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
