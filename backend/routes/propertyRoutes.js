const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public: list published properties only. Admins can pass ?all=true to see drafts too.
router.get('/', async (req, res) => {
  const { category, location, all } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (all !== 'true') filter.approvalStatus = 'published';
  const properties = await Property.find(filter).sort({ createdAt: -1 });
  res.json(properties);
});

router.get('/:id', async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Not found' });
  res.json(property);
});

// Admin: create/update — draft by default, publishing is a separate approval step
router.post('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  const property = await Property.create({ ...req.body, approvalStatus: 'draft' });
  res.status(201).json(property);
});

router.patch('/:id', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!property) return res.status(404).json({ message: 'Not found' });
  res.json(property);
});

// Explicit publish step — keeps legal-review gate visible in the workflow
router.post('/:id/publish', requireAuth, requireRole('super_admin'), async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: 'published' },
    { new: true }
  );
  if (!property) return res.status(404).json({ message: 'Not found' });
  res.json(property);
});

module.exports = router;