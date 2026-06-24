const express = require('express');
const router = express.Router();
const multer = require('multer');
const { importUsers } = require('../controllers/userController');

// Cấu hình Multer để lưu file tạm vào bộ nhớ RAM thay vì lưu thành file cứng trên ổ đĩa
const upload = multer({ storage: multer.memoryStorage() });

// Đường dẫn nhận file (nhận file qua biến tên là 'file')
router.post('/import', upload.single('file'), importUsers);

module.exports = router;