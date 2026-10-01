const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: { type: String, required: true },
  name: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  storeName: { type: String },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    shippingAddress: {
      name: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
      phone: { type: String },
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    totalAmount: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    paymentRail: { type: String, default: 'upi' },
    escrowStatus: {
      type: String,
      enum: ['secured', 'released', 'held_dispute', 'refunded'],
      default: 'secured',
    },
    tracking: {
      carrier: { type: String, default: 'Blue Dart Apex Heritage' },
      trackingNumber: { type: String, default: '' },
      dispatchedAt: { type: Date },
      estimatedDelivery: { type: Date },
      stages: [
        {
          label: { type: String },
          completed: { type: Boolean, default: false },
          timestamp: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.totalAmount && this.pricing && this.pricing.total) {
    this.totalAmount = this.pricing.total;
  }
});

module.exports = mongoose.model('Order', orderSchema);
