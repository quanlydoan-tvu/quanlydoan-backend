const express = require('express');
const router = express.Router();

// Gọi đến file xử lý logic mà bạn đã tạo lúc nãy
const authController = require('../controllers/authController');

// Đón luồng POST chứa email/password từ Frontend gửi sang
router.post('/login', authController.login);

module.exports = router;