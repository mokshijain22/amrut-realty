const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['executive', 'sub_admin', 'investor', 'jv_partner'] } })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/pending-kyc', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['investor', 'jv_partner'] },
      kycStatus: 'pending',
      kycDocs: { $exists: true, $not: { $size: 0 } },
    })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/kyc-approve', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { kycStatus: 'approved' },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/kyc-reject', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { kycStatus: 'rejected' },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;