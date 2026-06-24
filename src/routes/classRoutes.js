const express = require('express');
const router = express.Router();

// Nhúng cả 2 hàm từ Controller
const { getClasses, createClass } = require('../controllers/classController');
const { verifyToken } = require('../middleware/authMiddleware');

// [GET] Lấy danh sách lớp
router.get('/', verifyToken, getClasses);

// [POST] Tạo lớp mới
router.post('/', verifyToken, createClass);

module.exports = router;