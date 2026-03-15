const express = require('express');
const multer = require('multer');
const { submitPatrolReport, uploadImage, getReports } = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/tmp' });

router.post('/patrol-report', auth('guard'), submitPatrolReport);
router.post('/upload-image', auth('guard'), upload.single('image'), uploadImage);
router.get('/reports', auth('admin'), getReports);

module.exports = router;
