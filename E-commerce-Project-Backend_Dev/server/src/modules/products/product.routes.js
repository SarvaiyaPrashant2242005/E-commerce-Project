const express = require('express');
const router = express.Router();
const Product = require('./product.model');
const { formatSuccess, formatError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// GET /api/products - public catalog listing
router.get('/', async (req, res) => {
  try {
    const { search, category, store, storeId, sort = 'featured', page = 1, limit = 12 } = req.query;
    const query = {
      moderationStatus: { $in: ['approved', undefined, null] },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All Categories' && category !== 'all') {
      query.category = category;
    }

    const targetStore = store || storeId;
    if (targetStore) {
      query.$or = [
        { 'seller._id': targetStore },
        { storeId: targetStore },
      ];
    }

    let sortOptions = {};
    if (sort === 'price-low') sortOptions = { price: 1 };
    else if (sort === 'price-high') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else sortOptions = { isFeatured: -1, createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    return res.status(200).json(
      formatSuccess(
        {
          products,
          totalProducts,
          totalPages,
          currentPage: pageNum,
        },
        'Products retrieved successfully',
        { products } // for unwrap compatibility
      )
    );
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// GET /api/products/:id - single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(
        formatError(404, `Product with ID '${req.params.id}' not found.`, 'PRODUCT_NOT_FOUND')
      );
    }
    return res.status(200).json(formatSuccess(product, 'Product details retrieved successfully'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// POST /api/products - create product (vendor/admin)
router.post('/', authenticate, authorize('vendor', 'admin'), async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title && !payload.name) {
      return res.status(400).json(formatError(400, 'Product title is required', 'VALIDATION_ERROR'));
    }

    if (req.user.role === 'vendor') {
      payload.storeId = req.user.storeId;
      payload.storeName = req.user.storeName;
      payload.seller = {
        _id: req.user.storeId,
        name: req.user.storeName || req.user.name,
        storeName: req.user.storeName || req.user.name,
        location: req.user.phone || 'Artisan Atelier',
        isVerified: true,
      };
    }

    const newProduct = await Product.create(payload);
    return res.status(201).json(formatSuccess(newProduct, 'Artisan piece cataloged successfully'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// PUT /api/products/:id - update product
router.put('/:id', authenticate, authorize('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(formatError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
    }

    if (
      req.user.role === 'vendor' &&
      product.seller &&
      product.seller._id &&
      product.seller._id.toString() !== req.user.storeId?.toString()
    ) {
      return res.status(403).json(
        formatError(403, "You do not hold permission to modify this atelier's products.", 'FORBIDDEN')
      );
    }

    Object.assign(product, req.body);
    await product.save();
    return res.status(200).json(formatSuccess(product, 'Product updated successfully'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', authenticate, authorize('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(formatError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
    }

    if (
      req.user.role === 'vendor' &&
      product.seller &&
      product.seller._id &&
      product.seller._id.toString() !== req.user.storeId?.toString()
    ) {
      return res.status(403).json(
        formatError(403, "You do not hold permission to archive this atelier's products.", 'FORBIDDEN')
      );
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json(formatSuccess({ id: req.params.id }, 'Product archived from catalog'));
  } catch (error) {
    return res.status(500).json(formatError(500, error.message));
  }
});

module.exports = router;
