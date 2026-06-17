import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Dán trực tiếp chuỗi kết nối vào đây, được bọc trong dấu ngoặc kép
    url: "sqlserver://localhost:1433;database=QuanLyDoAn;user=sa;password=Giaovien@12345;encrypt=true;trustServerCertificate=true;",
  },
});