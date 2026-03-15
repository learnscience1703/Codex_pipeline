const express = require('express');
const { getGuards, approveGuard } = require('../controllers/guardController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', auth('admin'), getGuards);
router.post('/approve', auth('admin'), approveGuard);

module.exports = router;
