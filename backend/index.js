// File: backend/index.js (Thêm các API cho admin)

// API Admin
// Endpoint để đăng nhập admin (thiết lập trạng thái admin là true)
app.post("/api/admin/login", async (req, res) => {
  try {
    await writeAdminStatus(true); // Ghi trạng thái admin là true
    res.status(200).json({ message: "Đăng nhập admin thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng nhập admin:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập admin" });
  }
});

// Endpoint để đăng xuất admin (thiết lập trạng thái admin là false)
app.post("/api/admin/logout", async (req, res) => {
  try {
    await writeAdminStatus(false); // Ghi trạng thái admin là false
    res.status(200).json({ message: "Đăng xuất admin thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng xuất admin:", error);
    res.status(500).json({ message: "Lỗi server khi đăng xuất admin" });
  }
});

// Endpoint để kiểm tra trạng thái admin
app.get("/api/admin/status", async (req, res) => {
  try {
    const isAdmin = await readAdminStatus(); // Đọc trạng thái admin
    res.status(200).json({ admin_granted: isAdmin }); // Trả về trạng thái
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái admin:", error);
    res.status(500).json({ message: "Lỗi server khi kiểm tra trạng thái admin" });
  }
});

// Khởi động server
app.listen(PORT, async () => {
  // Đảm bảo các file dữ liệu tồn tại khi khởi động lần đầu
  try {
    await fs.access(USERS_FILE);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeUsers([]);
      console.log(`Created initial ${USERS_FILE}`);
    } else {
      throw err;
    }
  }
  try {
    await fs.access(ADMIN_FILE);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeAdminStatus(false);
      console.log(`Created initial ${ADMIN_FILE}`);
    } else {
      throw err;
    }
  }
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
