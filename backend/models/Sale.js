const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    executiveId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who closed it

    saleAmount: { type: Number, required: true },
    saleType: { type: String, enum: ['direct', 'team'], default: 'team' },

    status: { type: String, enum: ['booked', 'confirmed', 'cancelled'], default: 'booked' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
