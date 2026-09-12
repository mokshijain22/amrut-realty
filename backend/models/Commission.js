const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema(
  {
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: {
      type: String,
      enum: [
        'direct_sale',
        'team_override',
        'investor_referral',
        'jv_partner_share',
        'monthly_incentive',
        'roi_payout',
      ],
      required: true,
    },

    ratePercent: { type: Number, required: true },
    amount: { type: Number, required: true },
    level: { type: Number, default: null }, // which L-level this rollup represents, for team_override

    status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Commission', commissionSchema);
