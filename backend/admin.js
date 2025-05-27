// 📁 File: backend/adminRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = 'super-secret-key';
const adminUsername = 'admin';
const adminPassword = 'admin123';
const requestsFile = path.join(__dirname, '../data/pendingRequests.json');
const usersFile = path.join(__dirname, '../users.json');

// Đảm bảo tồn tại file pendingRequests.json
if (!fs.existsSync(requestsFile)) fs.writeFileSync(requestsFile, '[]');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
});

// Middleware xác thực token admin
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'admin') return res.sendStatus(403);
    next();
  } catch {
    return res.sendStatus(403);
  }
}

// GET /api/admin/requests
router.get('/requests', verifyAdmin, (req, res) => {
  const requests = readJSON(requestsFile);
  res.json(requests);
});

// POST /api/admin/approve/:id
router.post('/approve/:id', verifyAdmin, (req, res) => {
  let requests = readJSON(requestsFile);
  const users = readJSON(usersFile);
  const id = req.params.id;
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ message: 'Yêu cầu không tồn tại' });

  const { username, hardwareId } = requests[index];
  users.push({ username, hardwareId, createdAt: new Date().toISOString() });
  writeJSON(usersFile, users);

  requests.splice(index, 1);
  writeJSON(requestsFile, requests);
  res.json({ message: 'Đã duyệt' });
});

// POST /api/admin/reject/:id
router.post('/reject/:id', verifyAdmin, (req, res) => {
  let requests = readJSON(requestsFile);
  const id = req.params.id;
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ message: 'Yêu cầu không tồn tại' });
  requests.splice(index, 1);
  writeJSON(requestsFile, requests);
  res.json({ message: 'Đã từ chối' });
});

module.exports = router;
