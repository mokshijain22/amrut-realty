const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public: website enquiry form submits here
router.post('/', async (req, res) => {
  const { name, phone, email, propertyId, source } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'name and phone are required' });
  const lead = await Lead.create({ name, phone, email, propertyId, source: source || 'website' });
  res.status(201).json(lead);
});

// Staff: view/manage leads
router.get('/', requireAuth, requireRole('super_admin', 'sub_admin', 'executive'), async (req, res) => {
  const { status, assignedTo } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;
  else if (req.user.role === 'executive') filter.assignedTo = req.user.id; // executives see only their own
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).populate('propertyId', 'title');
  res.json(leads);
});

router.patch('/:id', requireAuth, requireRole('super_admin', 'sub_admin', 'executive'), async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) return res.status(404).json({ message: 'Not found' });
  res.json(lead);
});

module.exports = router;
