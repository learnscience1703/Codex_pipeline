const express = require('express');
const multer = require('multer');
const { uploadLocations, getLocations } = require('../controllers/locationController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth('admin'), upload.single('file'), uploadLocations);
router.get('/', auth(), getLocations);

module.exports = router;
