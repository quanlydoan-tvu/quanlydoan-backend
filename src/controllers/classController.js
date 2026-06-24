const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// [GET] /api/classes - Lấy danh sách lớp
const getClasses = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const role = req.user.role;

    let classes = [];

    if (role === 'teacher') {
      classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: { _count: { select: { enrollments: true } } } 
      });
    } else {
      classes = await prisma.class.findMany({
        where: { enrollments: { some: { studentId: userId } } },
        include: { teacher: { select: { name: true } } } 
      });
    }

    res.status(200).json(classes);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lớp:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// [POST] /api/classes - Tạo lớp học phần mới (Chỉ dành cho Giảng viên)
const createClass = async (req, res) => {
  try {
    // 1. Kiểm tra quyền: Nếu không phải giảng viên thì "mời ra ngoài"
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Từ chối truy cập. Chỉ giảng viên mới có quyền tạo lớp!' });
    }

    // 2. Lấy dữ liệu người dùng gửi lên
    const { classCode, className } = req.body;

    if (!classCode || !className) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ mã lớp và tên lớp!' });
    }

    // 3. Kiểm tra xem mã lớp đã tồn tại trong hệ thống chưa
    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode }
    });

    if (existingClass) {
      return res.status(400).json({ message: 'Mã lớp học phần này đã tồn tại!' });
    }

    // 4. Lưu vào Database
    const newClass = await prisma.class.create({
      data: {
        classCode: classCode,
        className: className,
        teacherId: req.user.userId // Lấy ID của chính giảng viên đang đăng nhập để gán vào lớp
      }
    });

    res.status(201).json({ message: 'Tạo lớp học phần thành công!', data: newClass });
  } catch (error) {
    console.error('Lỗi khi tạo lớp học phần:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// NHỚ XUẤT CẢ 2 HÀM RA NHÉ
module.exports = { getClasses, createClass };