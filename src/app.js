const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware cốt lõi
app.use(cors()); // Cấp phép cho Frontend (React Vite) kết nối
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Đăng ký đường ống API Đăng nhập
app.use('/api/auth', authRoutes);

// Tuyến đường mặc định để kiểm tra sức khỏe Server
app.get('/', (req, res) => {
  res.send('Chào mừng đến với hệ thống API Quản lý Đồ án - Backend đang hoạt động!');
});

// Khởi chạy máy chủ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Máy chủ Backend đã chạy thành công tại http://localhost:${PORT}`);
});