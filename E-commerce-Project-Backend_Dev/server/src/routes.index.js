const express = require('express');
const router = express.Router();

const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/product.routes');
const storeRoutes = require('./modules/stores/store.routes');
const orderRoutes = require('./modules/orders/order.routes');
const vendorRoutes = require('./modules/vendor/vendor.routes');
const adminRoutes = require('./modules/admin/admin.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/stores', storeRoutes);
router.use('/orders', orderRoutes);
router.use('/vendor', vendorRoutes);
router.use('/admin', adminRoutes);

// Compatibility fallback for payments
router.post('/payments/create-checkout-session', (req, res) => {
  res.json({
    success: true,
    code: 200,
    data: {
      url: '/order-success',
      sessionId: 'sess_' + Date.now(),
      amount: req.body.amount || 20720,
    },
  });
});

module.exports = router;
