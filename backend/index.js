const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/balance", (req, res) => {
  const balance = 85000; // Trả số dư giả định, có thể dùng DB sau
  res.json({ balance });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});