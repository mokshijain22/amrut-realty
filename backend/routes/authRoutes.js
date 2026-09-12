const express = require('express');
const router = express.Router();
const { register, login, me, createStaff } = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/staff', requireAuth, requireRole('super_admin'), createStaff);

module.exports = router;
