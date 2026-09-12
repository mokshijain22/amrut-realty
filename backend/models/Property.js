const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['plotting', 'residential', 'commercial', 'industrial', 'farm'],
      required: true,
    },
    location: { type: String, required: true, trim: true }, // Mumbai, Pune, Mahabaleshwar, Sangli, Kolhapur, Delhi...
    priceTotal: { type: Number, required: true },
    unitSize: { type: String },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    brochureUrl: { type: String },

    approvalStatus: {
      type: String,
      enum: ['draft', 'pending_legal', 'published'],
      default: 'draft',
    },
    reraDetails: { type: String },

    ownerType: { type: String, enum: ['company', 'jv_partner'], default: 'company' },
    jvPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
