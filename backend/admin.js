
// --- Content for backend/admin.js ---
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// --- Backend Configuration ---
const SECRET_KEY = 'super-secret-key'; // Keep this secret!
const adminUsername = 'admin'; // Example admin credentials
const adminPassword = 'admin123'; // Example admin credentials (use environment variables in production!)
const requestsFile = path.join(__dirname, '../data/pendingRequests.json'); // Path to pending requests file
const usersFile = path.join(__dirname, '../data/approvedUsers.json'); // Path to approved users file (renamed for clarity)

// Ensure data directory and files exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(requestsFile)) fs.writeFileSync(requestsFile, '[]');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');


// --- Helper Functions ---
function readJSON(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${file}:`, error);
    return []; // Return empty array on error
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing JSON file ${file}:`, error);
  }
}

// --- Backend Routes ---

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Basic authentication check (replace with secure method in production)
  if (username === adminUsername && password === adminPassword) {
    // Generate JWT token
    const token = jwt.sign({ role: 'admin', username: username }, SECRET_KEY, { expiresIn: '2h' }); // Token expires in 2 hours
    return res.json({ token });
  }
  // Authentication failed
  return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
});

// Middleware to verify admin token
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token xác thực' });
  }
  const token = authHeader.split(' ')[1]; // Extract token

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Check if the token payload has the admin role
    if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    // Attach decoded user info to request object (optional)
    req.user = decoded;
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Handle token verification errors (e.g., expired, invalid)
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

// GET /api/admin/requests - Get all pending requests
router.get('/requests', verifyAdmin, (req, res) => {
  const requests = readJSON(requestsFile);
  // Filter out requests that might have been processed but not removed (optional, depends on flow)
  // Or just return all from the pending file
  res.json(requests);
});

// POST /api/admin/approve/:id - Approve a request
router.post('/approve/:id', verifyAdmin, (req, res) => {
  let requests = readJSON(requestsFile);
  const users = readJSON(usersFile);
  const id = parseInt(req.params.id, 10); // Ensure ID is a number

  // Find the request by ID
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại' });
  }

  const requestToApprove = requests[index];

  // Add the approved user/key info to the users file
  // Ensure required fields exist on the request object
  if (!requestToApprove.username || !requestToApprove.hardwareId) {
       console.error('Invalid request data for approval:', requestToApprove);
       return res.status(400).json({ message: 'Dữ liệu yêu cầu không hợp lệ' });
  }

  // Check if user/hardwareId combination already exists in approved users (optional)
  const existingUser = users.find(u => u.username === requestToApprove.username && u.hardwareId === requestToApprove.hardwareId);
  if (existingUser) {
       console.warn(`Attempted to approve duplicate user/hardwareId: ${requestToApprove.username}/${requestToApprove.hardwareId}`);
       // Decide how to handle duplicates: return error, or just remove from pending
       // For now, we'll just remove from pending and return success
  } else {
      users.push({
          username: requestToApprove.username,
          hardwareId: requestToApprove.hardwareId,
          createdAt: new Date().toISOString(),
          approvedBy: req.user.username // Record which admin approved it (optional)
      });
      writeJSON(usersFile, users); // Save updated users list
  }


  // Remove the request from the pending list
  requests.splice(index, 1);
  writeJSON(requestsFile, requests); // Save updated requests list

  res.json({ message: 'Đã duyệt yêu cầu thành công' });
});

// POST /api/admin/reject/:id - Reject a request
router.post('/reject/:id', verifyAdmin, (req, res) => {
  let requests = readJSON(requestsFile);
  const id = parseInt(req.params.id, 10); // Ensure ID is a number

  // Find the request by ID
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại' });
  }

  // Remove the request from the pending list
  requests.splice(index, 1);
  writeJSON(requestsFile, requests); // Save updated requests list

  res.json({ message: 'Đã từ chối yêu cầu thành công' });
});

// Export the router (assuming this is part of a larger Express app)
module.exports = router;
