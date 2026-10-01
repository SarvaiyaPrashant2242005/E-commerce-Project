const express = require('express');
const router = express.Router();
const Product = require('../products/product.model');
const Order = require('../orders/order.model');
const Store = require('../stores/store.model');
const User = require('../users/user.model');
const VendorApplication = require('./vendorApplication.model');
const Settings = require('./settings.model');
const { formatSuccess, formatError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.use(authenticate, authorize('admin'));

// 1. GET /api/admin/metrics
router.get('/metrics', async (req, res) => {
  try {
    const [pendingApps, flaggedProducts, totalStores, totalProducts, totalOrders] = await Promise.all([
      VendorApplication.countDocuments({ status: 'pending' }),
      Product.countDocuments({ moderationStatus: { $in: ['quarantined', 'pending_review', 'rejected'] } }),
      Store.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    const metrics = {
      marketplaceGMV: 2480000,
      grossMerchandiseValueStr: '₹24.8L',
      netPlatformRevenue: 310000,
      activeGuildsCount: totalStores,
      verifiedArtisansCount: 48,
      curatedPiecesCount: totalProducts,
      activePatronsCount: 1820,
      pendingApplicationsCount: pendingApps,
      flaggedProductsCount: flaggedProducts || 0,
      escrowHeldTotal: 342000,
      escrowHeldTotalStr: '₹3.42L',
      platformTakeRatePct: 12.5,
      isSimulatedDevData: true,
      simulationNotice:
        'Development Demonstration Model: ₹24.8L GMV, ₹3.42L escrow hold and 12.5% take-rate are simulated development metrics.',
      categoryYield: [
        { category: 'Handlooms & Weaves', gmv: 682000, sharePct: 45.8 },
        { category: 'Ceramics & Pottery', gmv: 345000, sharePct: 23.2 },
        { category: 'Metal & Brassware', gmv: 241000, sharePct: 16.2 },
        { category: 'Gourmet & Terroir', gmv: 221000, sharePct: 14.8 },
      ],
      topClusters: [
        { name: 'Bagru & Sanganer Block-print Guild', gmv: 284000, percentage: 82 },
        { name: 'Moradabad Brass Artisan Co-op', gmv: 221000, percentage: 65 },
        { name: 'Kashmir Pashmina Master Weavers', gmv: 195000, percentage: 58 },
        { name: 'Varanasi Silk Weaver Syndicate', gmv: 184000, percentage: 52 },
      ],
      monthlyVolumeData: [
        { month: 'Jan', gmv: 180000 },
        { month: 'Feb', gmv: 220000 },
        { month: 'Mar', gmv: 310000 },
        { month: 'Apr', gmv: 390000 },
        { month: 'May', gmv: 480000 },
        { month: 'Jun', gmv: 620000 },
      ],
    };

    return res.status(200).json(formatSuccess(metrics, 'Marketplace telemetry synchronized'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 2. GET /api/admin/applications & PATCH /api/admin/applications/:id
router.get('/applications', async (req, res) => {
  try {
    const apps = await VendorApplication.find().sort({ createdAt: -1 });
    return res.status(200).json(formatSuccess(apps, 'Vendor applications retrieved', { applications: apps }));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

router.patch('/applications/:id', async (req, res) => {
  try {
    const { status, justification } = req.body;
    const app = await VendorApplication.findById(req.params.id);
    if (!app) {
      return res.status(404).json(formatError(404, 'Application not found'));
    }

    app.status = status;
    if (justification) app.justification = justification;
    await app.save();

    // If approved, create/activate store and upgrade applicant user
    if (status === 'approved') {
      let store = await Store.findOne({ slug: app.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-') });
      if (!store) {
        store = await Store.create({
          name: app.brandName,
          slug: app.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          tagline: app.description || 'Master Artisan Atelier',
          guild: app.guild,
          location: app.region,
          masterArtisan: app.artisanName,
          isVerified: true,
          status: 'active',
          badges: ['Master Guild Certified', 'Fair Wage Certified'],
          contactEmail: app.email,
          contactPhone: app.phone,
        });
      } else {
        store.status = 'active';
        store.isVerified = true;
        await store.save();
      }

      await User.findOneAndUpdate(
        { email: app.email.toLowerCase() },
        {
          role: 'vendor',
          storeId: store._id,
          storeName: store.name,
        }
      );
    }

    return res.status(200).json(
      formatSuccess(
        app,
        `Vendor application successfully ${status === 'approved' ? 'approved and atelier activated' : 'rejected'}`
      )
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 3. GET /api/admin/vendors & PATCH /api/admin/vendors/:id
router.get('/vendors', async (req, res) => {
  try {
    const [stores, apps] = await Promise.all([
      Store.find().sort({ createdAt: -1 }),
      VendorApplication.find().sort({ createdAt: -1 }),
    ]);

    const data = {
      registeredStores: stores,
      totalGuilds: stores.length,
      activeCount: stores.filter((s) => s.status !== 'suspended').length,
      suspendedCount: stores.filter((s) => s.status === 'suspended').length,
      applications: apps,
    };

    return res.status(200).json(formatSuccess(data, 'Vendors & guilds master directory loaded'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

router.patch('/vendors/:id', async (req, res) => {
  try {
    const { status } = req.body;
    let updated = await Store.findById(req.params.id);
    if (updated) {
      updated.status = status;
      await updated.save();
    } else {
      updated = await VendorApplication.findById(req.params.id);
      if (updated) {
        updated.status = status;
        await updated.save();
      }
    }

    if (!updated) {
      return res.status(404).json(formatError(404, 'Vendor/Store not found'));
    }

    return res.status(200).json(formatSuccess(updated, `Vendor status updated to ${status}`));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 4. GET /api/admin/products & PATCH /api/admin/products/:id/moderation
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(
      formatSuccess(products, 'Catalog items for moderation retrieved', { products })
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

router.patch('/products/:id/moderation', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(formatError(404, 'Product not found'));
    }

    product.moderationStatus = status;
    if (reason) product.moderationReason = reason;
    await product.save();

    return res.status(200).json(
      formatSuccess(
        product,
        `Product SKU ${product.sku || product._id} moderation state set to ${status}`
      )
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 5. GET /api/admin/orders & PATCH /api/admin/orders/:id/escrow
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(
      formatSuccess(orders, 'Marketplace orders and escrow ledger loaded', { orders })
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

router.patch('/orders/:id/escrow', async (req, res) => {
  try {
    const { escrowStatus, reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json(formatError(404, 'Order not found'));
    }

    order.escrowStatus = escrowStatus;
    await order.save();

    return res.status(200).json(
      formatSuccess(order, `Order ${order.orderNumber} escrow state overridden to ${escrowStatus}`)
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 6. GET /api/admin/settings & PUT /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'global_settings' });
    }
    return res.status(200).json(formatSuccess(settings, 'Platform configuration retrieved'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = new Settings({ key: 'global_settings' });
    }
    Object.assign(settings, req.body);
    await settings.save();
    return res.status(200).json(formatSuccess(settings, 'Platform settings successfully updated and persisted'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// 7. GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    return res.status(200).json(formatSuccess(customers, 'Patron roster loaded', { customers }));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

module.exports = router;
