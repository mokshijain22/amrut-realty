const User = require('../models/User');

/**
 * Recomputes and stores the upline chain (root -> ... -> parent) for a user,
 * based on their sponsorId. Called whenever a user's sponsor changes.
 */
async function rebuildUplineChain(userId) {
  const chain = [];
  let current = await User.findById(userId);
  if (!current) return [];

  let sponsorId = current.sponsorId;
  const seen = new Set([String(current._id)]); // guard against accidental cycles

  while (sponsorId) {
    if (seen.has(String(sponsorId))) break;
    seen.add(String(sponsorId));

    const sponsor = await User.findById(sponsorId).select('sponsorId isActive');
    if (!sponsor) break;

    chain.unshift(sponsor._id);
    sponsorId = sponsor.sponsorId;
  }

  await User.findByIdAndUpdate(userId, { uplineChain: chain });
  return chain;
}

/**
 * Returns up to `maxLevels` active upline members for commission rollup,
 * nearest sponsor first. Inactive executives are skipped but do not break
 * the chain (their own upline is still reachable).
 */
async function getEligibleUpline(userId, maxLevels = 9) {
  const user = await User.findById(userId).select('uplineChain');
  if (!user || !user.uplineChain.length) return [];

  // uplineChain is root-first; nearest sponsor is the last entry.
  const nearestFirst = [...user.uplineChain].reverse();

  const uplineUsers = await User.find({ _id: { $in: nearestFirst } }).select('isActive rank');
  const byId = new Map(uplineUsers.map((u) => [String(u._id), u]));

  const eligible = [];
  for (const id of nearestFirst) {
    const u = byId.get(String(id));
    if (u && u.isActive) {
      eligible.push(u);
      if (eligible.length >= maxLevels) break;
    }
  }
  return eligible;
}

module.exports = { rebuildUplineChain, getEligibleUpline };
