const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_settings', unique: true },
    platformLegalName: { type: String, default: 'VEYRA Mercantile Technologies Ltd.' },
    supportHelpline: { type: String, default: '1800-VEYRA-MKR (1800-83972-657)' },
    grievanceOfficer: { type: String, default: 'Vikramaditya Roy (Designated Director)' },
    grievanceEmail: { type: String, default: 'grievance@veyra.in' },
    maintenanceMode: { type: Boolean, default: false },
    commissions: {
      textiles: { type: Number, default: 8.0 },
      metal: { type: Number, default: 10.0 },
      gourmet: { type: Number, default: 6.0 },
      ceramics: { type: Number, default: 8.0 },
      woodcraft: { type: Number, default: 9.0 },
    },
    baseTakeRatePct: { type: Number, default: 12.5 },
    escrowHoldHours: { type: Number, default: 48 },
    escrowReleaseDays: { type: Number, default: 7 },
    minimumPayoutThreshold: { type: Number, default: 10000 },
    curationReviewPolicy: { type: String, default: 'Strict Hand-Craft & GI Verification' },
    sessionTimeoutMin: { type: Number, default: 15 },
    allowedCidr: { type: String, default: '103.21.58.0/24' },
    mandatoryJustification: { type: Boolean, default: true },
    allowedGuilds: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
