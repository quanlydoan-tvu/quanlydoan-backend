const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaDinhVaHung';

// 1. Middleware kiểm tra xem người dùng đã đăng nhập (có Token hợp lệ) chưa
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token thường nằm ở dạng: Bearer <chuỗi_token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Quyền truy cập bị từ chối. Vui lòng đăng nhập!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Mã xác thực đã hết hạn hoặc không hợp lệ!' });
    }
    req.user = decodedUser; // Lưu thông tin người dùng vào request để dùng ở các hàm sau
    next(); // Cho phép đi tiếp vào Controller
  });
};

// 2. Middleware phân quyền chuyên sâu (Kiểm tra vai trò USER)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này!' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };