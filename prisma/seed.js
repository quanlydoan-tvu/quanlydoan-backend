const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu tạo dữ liệu mẫu...');

  // Mã hóa mật khẩu '123456' để chuẩn bảo mật
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Tạo tài khoản Giảng viên
  const teacher = await prisma.user.upsert({
    where: { email: 'giangvien@tvu.edu.vn' },
    update: {}, // Nếu có rồi thì bỏ qua
    create: {
      email: 'giangvien@tvu.edu.vn',
      password: hashedPassword,
      fullName: 'Nguyễn Hoàng Duy Thiện',
      role: 'TEACHER',
    },
  });

  // 2. Tạo tài khoản Sinh viên
  const student = await prisma.user.upsert({
    where: { email: 'sinhvien@tvu.edu.vn' },
    update: {},
    create: {
      email: 'sinhvien@tvu.edu.vn',
      password: hashedPassword,
      fullName: 'Phan Hoàng Dinh',
      role: 'STUDENT',
    },
  });

  console.log('✅ Đã tạo thành công 2 tài khoản:');
  console.log('- Giảng viên:', teacher.email);
  console.log('- Sinh viên:', student.email);
}

main()
  .catch((e) => {
    console.error('Lỗi khi tạo dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });