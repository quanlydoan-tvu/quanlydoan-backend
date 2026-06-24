const express = require('express');
const cors = require('cors');

// Import các đường dẫn (Routes)
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes'); 
const userRoutes = require('./routes/userRoutes'); // Đã thêm Route cho User

const app = express();

// Middleware cốt lõi
app.use(cors()); // Cấp phép cho Frontend (React Vite) kết nối
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Đăng ký các đường ống API
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/users', userRoutes); // Đã đăng ký đường ống API cho User

// Tuyến đường mặc định để kiểm tra sức khỏe Server
app.get('/', (req, res) => {
  res.send('Chào mừng đến với hệ thống API Quản lý Đồ án - Backend đang hoạt động!');
});

// Khởi chạy máy chủ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Máy chủ Backend đã chạy thành công tại http://localhost:${PORT}`);
});