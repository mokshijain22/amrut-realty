const mongoose = require('mongoose');

// Configurable rate table so figures like the ₹48k/₹1.5L/₹60k examples in the
// client's notes become settings management can edit, not hardcoded numbers.
const commissionSlabSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['plotting', 'flats', 'commercial', 'roi', 'investor_referral'],
      required: true,
    },
    thresholdAmount: { type: Number, required: true }, // e.g. 1200000, 5000000
    ratePercent: { type: Number, required: true }, // e.g. 4, 3, 2
    effectiveFrom: { type: Date, default: Date.now },

    // Nothing calculates live payouts from a slab until management has signed off,
    // per the legal/compliance requirement in the business plan.
    approvedByManagement: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommissionSlab', commissionSlabSchema);
