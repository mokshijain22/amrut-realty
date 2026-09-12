const express = require('express');
const router = express.Router();
const CommissionSlab = require('../models/CommissionSlab');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  const slabs = await CommissionSlab.find().sort({ category: 1, thresholdAmount: 1 });
  res.json(slabs);
});

// Created unapproved by default — a super_admin must explicitly approve before it's used live
router.post('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  const slab = await CommissionSlab.create({ ...req.body, approvedByManagement: false });
  res.status(201).json(slab);
});

router.post('/:id/approve', requireAuth, requireRole('super_admin'), async (req, res) => {
  const slab = await CommissionSlab.findByIdAndUpdate(
    req.params.id,
    { approvedByManagement: true },
    { new: true }
  );
  if (!slab) return res.status(404).json({ message: 'Not found' });
  res.json(slab);
});

module.exports = router;
