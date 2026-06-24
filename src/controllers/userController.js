const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const xlsx = require('xlsx');

// [POST] /api/users/import - Nạp danh sách người dùng từ Excel
const importUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên file Excel!' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; 
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // IN RA DỮ LIỆU ĐỌC ĐƯỢC ĐỂ KIỂM TRA TÊN CỘT
    console.log('Dữ liệu thô từ Excel:', sheetData);

    if (sheetData.length === 0) {
      return res.status(400).json({ message: 'File Excel trống!' });
    }

    const usersToInsert = sheetData
      .map(row => {
        // Trích xuất các key của row ra để quét, đề phòng bạn gõ dư dấu cách trong Excel
        const nameKey = Object.keys(row).find(k => k.trim() === 'Họ Tên');
        const emailKey = Object.keys(row).find(k => k.trim() === 'Email');
        const roleKey = Object.keys(row).find(k => k.trim() === 'Vai trò');

        return {
          name: nameKey ? String(row[nameKey]).trim() : undefined,
          email: emailKey ? String(row[emailKey]).trim() : undefined,
          password: '123456', 
          role: (roleKey ? String(row[roleKey]).trim() : 'student').toLowerCase()
        };
      })
      .filter(user => user.email && user.name); // Lọc bỏ các dòng trống

    console.log('Dữ liệu chuẩn bị nạp vào Database:', usersToInsert);

    if (usersToInsert.length === 0) {
      return res.status(400).json({ 
        message: 'Không tìm thấy dữ liệu hợp lệ! Vui lòng kiểm tra lại tên cột (Họ Tên, Email, Vai trò).' 
      });
    }

// Đẩy vào Database (Xử lý dành riêng cho SQL Server)
    let insertedCount = 0;

    for (const user of usersToInsert) {
      // 1. Kiểm tra xem email này đã tồn tại trong Database chưa
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      // 2. Nếu chưa tồn tại, tiến hành tạo mới
      if (!existingUser) {
        await prisma.user.create({
          data: user
        });
        insertedCount++; // Tăng biến đếm số tài khoản tạo thành công
      }
    }

    res.status(200).json({
      message: 'Nạp dữ liệu thành công!',
      totalInserted: insertedCount 
    });

  } catch (error) {
    console.error('Lỗi khi import Excel:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi đọc file' });
  }
};

module.exports = { importUsers };