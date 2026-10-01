const express = require('express');
const router = express.Router();
const Order = require('./order.model');
const { formatSuccess, formatError } = require('../../utils/response');
const { authenticate } = require('../../middlewares/auth.middleware');

// GET /api/orders - list customer or filtered orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { customerId, storeId } = req.query;
    const query = {};

    if (req.user.role === 'customer') {
      query['customer._id'] = req.user._id;
    } else if (customerId) {
      query['customer._id'] = customerId;
    }

    if (storeId) {
      query['items.storeId'] = storeId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.status(200).json(formatSuccess(orders, 'Orders retrieved successfully', { orders }));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// GET /api/orders/:id - single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json(formatError(404, 'Order not found', 'ORDER_NOT_FOUND'));
    }
    return res.status(200).json(formatSuccess(order, 'Order details retrieved'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// POST /api/orders - create order (checkout)
router.post('/', authenticate, async (req, res) => {
  try {
    const body = req.body;
    const orderNumber = 'VYR-' + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderNumber,
      customer: {
        _id: req.user._id,
        name: body.customer?.name || req.user.name,
        email: body.customer?.email || req.user.email,
        phone: body.customer?.phone || req.user.phone,
      },
      shippingAddress: body.shippingAddress || (req.user.savedAddresses && req.user.savedAddresses[0]) || {
        name: req.user.name,
        addressLine1: 'Heritage Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      items: body.items || [],
      pricing: body.pricing || {
        subtotal: body.totalAmount || 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: body.totalAmount || 0,
      },
      totalAmount: body.totalAmount || body.pricing?.total || 0,
      status: 'confirmed',
      paymentStatus: 'paid',
      escrowStatus: 'secured',
      tracking: {
        carrier: 'Blue Dart Apex Heritage',
        trackingNumber: 'BD' + Math.floor(100000000 + Math.random() * 900000000) + 'IN',
        dispatchedAt: new Date(),
        stages: [
          { label: 'Commission Received', completed: true, timestamp: 'Just now' },
          { label: 'Artisan Guild Inspection', completed: true, timestamp: 'In progress' },
          { label: 'Sealed & Dispatched', completed: false, timestamp: 'Pending dispatch' },
          { label: 'Delivered to Sanctuary', completed: false, timestamp: 'Est. 4-5 business days' },
        ],
      },
    };

    const newOrder = await Order.create(orderData);
    return res.status(201).json(formatSuccess(newOrder, 'Commission confirmed and artisan notified'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json(formatError(404, 'Order not found', 'ORDER_NOT_FOUND'));
    }

    order.status = status;
    await order.save();
    return res.status(200).json(formatSuccess(order, `Order status updated to ${status}`));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

module.exports = router;
