const express = require('express');
const auth = require('../middleware/authMiddleware');
const { exportExcel, exportKmz } = require('../controllers/exportController');

const router = express.Router();
router.get('/excel', auth('admin'), exportExcel);
router.get('/kmz', auth('admin'), exportKmz);

module.exports = router;
