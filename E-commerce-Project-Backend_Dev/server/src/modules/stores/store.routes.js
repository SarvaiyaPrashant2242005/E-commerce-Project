const express = require('express');
const router = express.Router();
const Store = require('./store.model');
const Product = require('../products/product.model');
const VendorApplication = require('../admin/vendorApplication.model');
const { formatSuccess, formatError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// GET /api/stores - list all active stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ status: { $ne: 'suspended' } });
    return res.status(200).json(formatSuccess(stores, 'Stores retrieved successfully', { stores }));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// GET /api/stores/:id - single store with products
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json(formatError(404, 'Store not found', 'STORE_NOT_FOUND'));
    }

    const products = await Product.find({
      $or: [{ 'seller._id': store._id }, { storeId: store._id }],
      moderationStatus: { $in: ['approved', undefined, null] },
    }).limit(20);

    const storeData = {
      ...store.toObject(),
      products,
    };

    return res.status(200).json(formatSuccess(storeData, 'Store details retrieved'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// PUT /api/stores/:id - update store settings
router.put('/:id', authenticate, authorize('vendor', 'admin'), async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json(formatError(404, 'Store not found', 'STORE_NOT_FOUND'));
    }

    if (req.user.role === 'vendor' && req.user.storeId?.toString() !== req.params.id) {
      return res.status(403).json(formatError(403, 'Unauthorized to modify this store', 'FORBIDDEN'));
    }

    Object.assign(store, req.body);
    await store.save();
    return res.status(200).json(formatSuccess(store, 'Atelier settings updated'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// POST /api/stores/onboard - artisan application
router.post('/onboard', async (req, res) => {
  try {
    const newApp = await VendorApplication.create({
      ...req.body,
      status: 'pending',
      appliedAt: new Date(),
    });
    return res.status(201).json(formatSuccess(newApp, 'Artisan guild application submitted for review'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

module.exports = router;
