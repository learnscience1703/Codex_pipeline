const express = require('express');
const { createAssignment, getGuardAssignments, getAllAssignments } = require('../controllers/assignmentController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', auth('admin'), createAssignment);
router.get('/', auth('admin'), getAllAssignments);
router.get('/guard/assignments', auth('guard'), getGuardAssignments);

module.exports = router;
