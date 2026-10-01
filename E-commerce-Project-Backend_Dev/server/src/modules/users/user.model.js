const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Primary Sanctuary' },
  isDefault: { type: Boolean, default: false },
  name: { type: String, required: true },
  phone: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      default: 'customer',
    },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    adminLevel: { type: String },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    storeName: { type: String },
    savedAddresses: [addressSchema],
    token: { type: String }, // mock or stored token if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
