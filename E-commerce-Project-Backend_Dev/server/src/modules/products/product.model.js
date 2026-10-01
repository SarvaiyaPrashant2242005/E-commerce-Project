const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, default: 0 },
    image: { type: String, default: '' },
    images: [{ type: String }],
    rating: { type: Number, default: 5.0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isGiCertified: { type: Boolean, default: false },
    moderationStatus: {
      type: String,
      enum: ['approved', 'pending', 'pending_review', 'quarantined', 'rejected'],
      default: 'approved',
    },
    moderationReason: { type: String, default: '' },
    sku: { type: String },
    seller: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
      name: { type: String },
      storeName: { type: String },
      location: { type: String },
      isVerified: { type: Boolean, default: true },
    },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    storeName: { type: String },
    attributes: {
      origin: { type: String },
      material: { type: String },
      craftTime: { type: String },
      dimensions: { type: String },
      care: { type: String },
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Pre-save hook to ensure title/name and storeId/seller sync
productSchema.pre('save', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0];
  }
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
  if (!this.storeId && this.seller && this.seller._id) {
    this.storeId = this.seller._id;
  }
  if (!this.storeName && this.seller && (this.seller.storeName || this.seller.name)) {
    this.storeName = this.seller.storeName || this.seller.name;
  }
});

module.exports = mongoose.model('Product', productSchema);
