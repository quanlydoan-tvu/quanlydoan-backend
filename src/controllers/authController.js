const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaDinhVaHung';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm người dùng bằng email trong bảng User mới
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại trên hệ thống!' });
    }

    // 2. Kiểm tra mật khẩu (Hỗ trợ cả pass băm và chuỗi thường để tiện test)
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
    }

    // 3. Tạo mã token xác thực chứa ID và Quyền hạn (Role)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Mã token có hiệu lực trong 1 ngày
    );

    // 4. Trả kết quả chuẩn về cho Frontend React nhận diện
    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Lỗi API Đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống máy chủ Backend!' });
  }
};

module.exports = { login };