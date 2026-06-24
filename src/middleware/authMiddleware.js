const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy Token. Vui lòng đăng nhập!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chuoi_bi_mat_cua_ban');
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// DÒNG NÀY QUAN TRỌNG NHẤT: Phải có cặp ngoặc nhọn { }
module.exports = { verifyToken };