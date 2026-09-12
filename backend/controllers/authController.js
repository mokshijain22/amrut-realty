const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { rebuildUplineChain } = require('../services/treeService');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

const PUBLIC_ROLES = ['customer', 'investor', 'jv_partner'];

async function register(req, res) {
  try {
    const { name, email, phone, password, role, sponsorId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const safeRole = PUBLIC_ROLES.includes(role) ? role : 'customer';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email, phone, role: safeRole, sponsorId: sponsorId || null });
    await user.setPassword(password);
    await user.save();

    if (sponsorId) await rebuildUplineChain(user._id);

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const STAFF_CREATABLE_ROLES = ['executive', 'sub_admin', 'investor', 'jv_partner'];

async function createStaff(req, res) {
  try {
    const { name, email, phone, password, role, sponsorId, preApprove } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }
    if (!STAFF_CREATABLE_ROLES.includes(role)) {
      return res.status(400).json({ message: 'role must be executive, sub_admin, investor, or jv_partner' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const isPartnerRole = ['investor', 'jv_partner'].includes(role);
    const kycStatus = isPartnerRole && preApprove ? 'approved' : 'pending';

    const user = new User({ name, email, phone, role, sponsorId: sponsorId || null, kycStatus });
    await user.setPassword(password);
    await user.save();

    if (sponsorId) await rebuildUplineChain(user._id);

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, kycStatus: user.kycStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, rank: user.rank },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

module.exports = { register, login, me, createStaff };
