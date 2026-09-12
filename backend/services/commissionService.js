const CommissionSlab = require('../models/CommissionSlab');
const Commission = require('../models/Commission');
const { getEligibleUpline } = require('./treeService');

/**
 * Finds the applicable, management-approved slab for a category + amount.
 * Highest thresholdAmount at or below saleAmount wins.
 */
async function findSlab(category, saleAmount) {
  return CommissionSlab.findOne({
    category,
    approvedByManagement: true,
    thresholdAmount: { $lte: saleAmount },
  }).sort({ thresholdAmount: -1 });
}

/**
 * Splits a Sale into direct_sale + team_override Commission records.
 * - Direct sales (saleType: 'direct') credit the closing executive only.
 * - Team sales (saleType: 'team') also roll a share up the active upline chain.
 * Nothing is created if no approved slab exists yet for that category.
 */
async function calculateSaleCommission(sale, categoryForSlab) {
  const slab = await findSlab(categoryForSlab, sale.saleAmount);
  if (!slab) {
    return { created: [], reason: 'No management-approved commission slab found for this category/amount.' };
  }

  const created = [];
  const totalCommission = (sale.saleAmount * slab.ratePercent) / 100;

  // Direct commission to the closing executive
  const direct = await Commission.create({
    saleId: sale._id,
    beneficiaryId: sale.executiveId,
    type: 'direct_sale',
    ratePercent: slab.ratePercent,
    amount: totalCommission,
  });
  created.push(direct);

  // Team override rollup, only for team-type sales, only to active upline
  if (sale.saleType === 'team') {
    const upline = await getEligibleUpline(sale.executiveId);
    for (let i = 0; i < upline.length; i++) {
      const overrideAmount = totalCommission * 0.1; // placeholder split — confirm actual per-level rate with management
      const record = await Commission.create({
        saleId: sale._id,
        beneficiaryId: upline[i]._id,
        type: 'team_override',
        ratePercent: slab.ratePercent,
        amount: overrideAmount,
        level: i + 1,
      });
      created.push(record);
    }
  }

  return { created, slabUsed: slab };
}

/**
 * Flat, single-level investor-refers-investor bonus (3% per the notes).
 * Independent of the tree — does not roll further up.
 */
async function calculateInvestorReferralCommission({ saleId, referrerId, saleAmount, ratePercent = 3 }) {
  return Commission.create({
    saleId,
    beneficiaryId: referrerId,
    type: 'investor_referral',
    ratePercent,
    amount: (saleAmount * ratePercent) / 100,
  });
}

module.exports = { findSlab, calculateSaleCommission, calculateInvestorReferralCommission };
