const mongoose = require('mongoose');

const vendorApplicationSchema = new mongoose.Schema(
  {
    artisanName: { type: String, required: true },
    brandName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    guild: { type: String, default: 'Textiles & Weaves' },
    region: { type: String },
    craftCluster: { type: String },
    experienceYears: { type: Number, default: 0 },
    gstin: { type: String },
    giCode: { type: String },
    pehchanId: { type: String },
    bankVerified: { type: Boolean, default: true },
    bankName: { type: String },
    workshopFootprint: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    justification: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VendorApplication', vendorApplicationSchema);
