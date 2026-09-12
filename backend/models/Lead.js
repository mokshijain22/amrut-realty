const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    source: { type: String, enum: ['website', 'whatsapp', 'call', 'referral'], default: 'website' },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['new', 'contacted', 'site_visit_scheduled', 'site_visit_done', 'booked', 'lost'],
      default: 'new',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
