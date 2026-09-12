const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { requireAuth, requireRole } = require('../middleware/auth');
const { calculateSaleCommission } = require('../services/commissionService');

router.get('/', requireAuth, requireRole('super_admin', 'sub_admin'), async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 }).populate('propertyId customerId executiveId');
  res.json(sales);
});

// Creates the sale, then attempts commission calc (no-ops safely if slab isn't approved yet)
router.post('/', requireAuth, requireRole('super_admin', 'sub_admin', 'executive'), async (req, res) => {
  try {
    const { propertyId, customerId, saleAmount, saleType, categoryForSlab } = req.body;
    const sale = await Sale.create({
      propertyId,
      customerId,
      executiveId: req.user.id,
      saleAmount,
      saleType: saleType || 'team',
    });

    const commissionResult = await calculateSaleCommission(sale, categoryForSlab);
    res.status(201).json({ sale, commission: commissionResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
