const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RANKS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];
const ROLES = ['super_admin', 'sub_admin', 'executive', 'investor', 'jv_partner', 'customer'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ROLES, default: 'executive' },
    rank: { type: String, enum: RANKS, default: 'L1' },

    // MLM tree pointers
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    uplineChain: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // precomputed, root-to-parent order

    isActive: { type: Boolean, default: true }, // gates eligibility for team-override commission

    kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    kycDocs: [{ type: String }],

    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, 10);
};

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
module.exports.RANKS = RANKS;
module.exports.ROLES = ROLES;
