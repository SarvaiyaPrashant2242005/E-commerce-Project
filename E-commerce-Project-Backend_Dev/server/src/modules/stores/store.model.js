const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    guild: { type: String, default: 'Textiles & Weaves' },
    location: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    avatarImage: { type: String, default: '' },
    masterArtisan: { type: String, default: '' },
    artisanTitle: { type: String, default: '' },
    artisanStory: { type: String, default: '' },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    establishedYear: { type: Number, default: 2020 },
    isVerified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    badges: [{ type: String }],
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    socials: {
      instagram: { type: String, default: '' },
      journal: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
