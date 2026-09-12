const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['executive', 'sub_admin'] } })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;