// In-Memory & LocalStorage Stateful Mock Database for VEYRA Development
import { initialProducts, initialStores, initialReviews, initialOrders, demoUsers } from "./seedData.js";

const STORAGE_KEYS = {
  PRODUCTS: "veyra_mock_products_v1",
  STORES: "veyra_mock_stores_v1",
  REVIEWS: "veyra_mock_reviews_v1",
  ORDERS: "veyra_mock_orders_v1",
  USERS: "veyra_mock_users_v1",
  VENDOR_APPS: "veyra_mock_vendor_apps_v1",
  SETTINGS: "veyra_mock_settings_v1",
};

const initialVendorApplications = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9a91",
    artisanName: "Ghulam Nabi",
    brandName: "Kashmir Loom Masters",
    email: "ghulam@kashmirlooms.org",
    phone: "+91 94190 28192",
    guild: "Textiles & Weaves",
    region: "Srinagar, J&K",
    craftCluster: "Pashmina & Kani Weaves",
    experienceYears: 28,
    gstin: "01AABCK9921E1Z3",
    giCode: "GI-7401-JK",
    pehchanId: "PEH-7401-SRN",
    bankVerified: true,
    bankName: "J&K Bank (Srinagar Main)",
    workshopFootprint: "14 Traditional Pit Looms, 32 Registered Master Weavers",
    description: "Centuries-old kani needlework and charkha spun Changthangi pashmina shawls with zero synthetic blends.",
    status: "pending",
    priority: "high",
    appliedAt: "2026-09-25T15:20:00Z",
    leadTimeHours: 3
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a92",
    artisanName: "R. Sharma",
    brandName: "Moradabad Brass Artisan Co-op",
    email: "sharma@moradabadbrass.in",
    phone: "+91 591 249 1102",
    guild: "Metalware & Brass",
    region: "Moradabad, UP",
    craftCluster: "Cast Brass & Bell Metal",
    experienceYears: 22,
    gstin: "09AAACR4412B1Z8",
    giCode: "GI-UP-210",
    pehchanId: "PEH-9921-MB",
    bankVerified: true,
    bankName: "State Bank of India (Brass Market)",
    workshopFootprint: "8 Coal & Gas Kiln Crucibles, 45 Metal Crafters",
    description: "Hand-chiseled sand casting, lost-wax brass lamps, and traditional bell metal vessels.",
    status: "pending",
    priority: "medium",
    appliedAt: "2026-09-25T12:00:00Z",
    leadTimeHours: 6
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a93",
    artisanName: "Rizwan Khatri",
    brandName: "Kutch Rogan Art Studio",
    email: "rizwan@roganartkutch.com",
    phone: "+91 2832 284 311",
    guild: "Heritage Art & Paintings",
    region: "Nirona, Gujarat",
    craftCluster: "Rogan Castor Art",
    experienceYears: 19,
    gstin: "Exempt (<20L Micro)",
    giCode: "GI-ROGAN-04",
    pehchanId: "PEH-8832-KTCH",
    bankVerified: true,
    bankName: "Bank of Baroda (Bhuj)",
    workshopFootprint: "Single Family Heritage Atelier (300 Year Dynasty)",
    description: "Boiled castor oil paste pigments drawn freehand with metal styluses onto dense handloom fabrics.",
    status: "pending",
    priority: "high",
    appliedAt: "2026-09-25T09:15:00Z",
    leadTimeHours: 9
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a94",
    artisanName: "B. Mukherjee",
    brandName: "Santipur Tant Weaver Collective",
    email: "mukherjee@santipurtant.org",
    phone: "+91 3473 221 009",
    guild: "Textiles & Weaves",
    region: "Nadia, West Bengal",
    craftCluster: "Tant Handloom",
    experienceYears: 32,
    gstin: "19AAACT8821F1ZX",
    giCode: "GI-WB-551",
    pehchanId: "PEH-5510-NDIA",
    bankVerified: true,
    bankName: "Punjab National Bank (Santipur)",
    workshopFootprint: "60 Fly-Shuttle Pit Looms, 110 Cooperative Spinners",
    description: "Fine count superfine cotton tant sarees woven with jacquard border poetry.",
    status: "pending",
    priority: "medium",
    appliedAt: "2026-09-24T18:00:00Z",
    leadTimeHours: 24
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a95",
    artisanName: "H. Gowda",
    brandName: "Channapatna Toy Artisans Hub",
    email: "gowda@channapatnatoys.in",
    phone: "+91 80 2725 4490",
    guild: "Woodcraft & Furniture",
    region: "Ramanagara, Karnataka",
    craftCluster: "Ivory Wood Lacquer",
    experienceYears: 15,
    gstin: "29AABCC1102D1ZS",
    giCode: "GI-KA-012",
    pehchanId: "PEH-1204-CHNA",
    bankVerified: true,
    bankName: "Canara Bank (Ramanagara)",
    workshopFootprint: "Lathe Turning Units, Non-Toxic Natural Vegetable Lacquers",
    description: "Traditional lathe-turned Wrightia tinctoria wooden toys glazed with natural vegetable dyes.",
    status: "pending",
    priority: "low",
    appliedAt: "2026-09-23T11:30:00Z",
    leadTimeHours: 48
  }
];

const initialDefaultSettings = {
  platformLegalName: "VEYRA Mercantile Technologies Ltd.",
  supportHelpline: "1800-VEYRA-MKR (1800-83972-657)",
  grievanceOfficer: "Vikramaditya Roy (Designated Director)",
  grievanceEmail: "grievance@veyra.in",
  maintenanceMode: false,
  commissions: {
    textiles: 8.0,
    metal: 10.0,
    gourmet: 6.0,
    ceramics: 8.0,
    woodcraft: 9.0
  },
  baseTakeRatePct: 12.5,
  escrowHoldHours: 48,
  escrowReleaseDays: 7,
  minimumPayoutThreshold: 10000,
  curationReviewPolicy: "Strict Hand-Craft & GI Verification",
  sessionTimeoutMin: 15,
  allowedCidr: "103.21.58.0/24",
  mandatoryJustification: true,
  allowedGuilds: [
    "Textiles & Weaves",
    "Ceramics & Stoneware",
    "Jewelry & Adornment",
    "Woodcraft & Furniture",
    "Fragrance & Rituals",
    "Metalware & Brass"
  ]
};

const loadOrInit = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[MockStore] Failed to read ${key} from localStorage, using fallback`, e);
    return fallback;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[MockStore] Failed to save ${key} to localStorage`, e);
  }
};

class MockDatabase {
  constructor() {
    this.products = loadOrInit(STORAGE_KEYS.PRODUCTS, initialProducts);
    this.stores = loadOrInit(STORAGE_KEYS.STORES, initialStores);
    this.reviews = loadOrInit(STORAGE_KEYS.REVIEWS, initialReviews);
    this.orders = loadOrInit(STORAGE_KEYS.ORDERS, initialOrders);
    this.users = loadOrInit(STORAGE_KEYS.USERS, demoUsers);
    this.vendorApps = loadOrInit(STORAGE_KEYS.VENDOR_APPS, initialVendorApplications);
    this.settings = loadOrInit(STORAGE_KEYS.SETTINGS, initialDefaultSettings);

    // Ensure all products have moderationStatus set
    let prodUpdated = false;
    this.products.forEach((p) => {
      if (!p.moderationStatus) {
        p.moderationStatus = "approved";
        prodUpdated = true;
      }
    });

    // Ensure we have a couple of flagged products for admin moderation review demonstration
    const hasFlagged = this.products.some((p) => p.moderationStatus === "quarantined" || p.moderationStatus === "pending_review");
    if (!hasFlagged) {
      this.products.push(
        {
          _id: "66f44d5c9e2b1a3d4f8e9m01",
          sku: "SKU-PR-9821",
          title: "Machine-spun \"Pure Pashmina\" Stole",
          name: "Machine-spun \"Pure Pashmina\" Stole",
          price: 4999,
          stock: 4,
          category: "Textiles & Weaves",
          image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80"],
          seller: {
            _id: "store-synth-1",
            name: "Urban Heritage Threads",
            storeName: "Urban Heritage Threads"
          },
          storeId: "store-synth-1",
          storeName: "Urban Heritage Threads",
          moderationStatus: "quarantined",
          severity: "critical",
          flagReason: "Failed Burn-Test lab spectrometry submitted by patron (34% synthetic acrylic blend detected).",
          giCode: "GI-7401-JK",
          caseRef: "CASE-8812",
          openSince: "2h 45m"
        },
        {
          _id: "66f44d5c9e2b1a3d4f8e9m02",
          sku: "SKU-PR-8402",
          title: "Chettinad Teak Pillar Console Table",
          name: "Chettinad Teak Pillar Console Table",
          price: 34500,
          stock: 1,
          category: "Woodcraft & Furniture",
          image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"],
          seller: {
            _id: "store-wood-1",
            name: "Heritage Woodworks Karaikudi",
            storeName: "Heritage Woodworks Karaikudi"
          },
          storeId: "store-wood-1",
          storeName: "Heritage Woodworks Karaikudi",
          moderationStatus: "quarantined",
          severity: "warning",
          flagReason: "Weight dispute at Delhivery logistics hub (+12.4kg discrepancy vs declared AWB rate card).",
          caseRef: "CASE-8402",
          openSince: "5h 10m"
        }
      );
      prodUpdated = true;
    }

    if (prodUpdated) {
      save(STORAGE_KEYS.PRODUCTS, this.products);
    }
  }

  // ---------- Products ----------
  getProducts({ search, category, storeId, sort, page = 1, limit = 12 } = {}) {
    // Only return products that are approved in the public catalog!
    let list = this.products.filter(
      (p) => p.moderationStatus === "approved" || !p.moderationStatus
    );

    if (category && category !== "All" && category !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (storeId) {
      list = list.filter((p) => p.seller?._id === storeId || p.storeId === storeId);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list.reverse();

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      totalProducts: total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page),
      limit: Number(limit)
    };
  }

  getProductById(id) {
    return this.products.find((p) => p._id === id || p._id === String(id)) || null;
  }

  // For Admin Control Plane (includes all flagged, quarantined, and live items)
  getProductsForModeration() {
    return this.products;
  }

  updateProductModeration(id, status, reason = "") {
    const idx = this.products.findIndex((p) => p._id === id || p.sku === id);
    if (idx === -1) return null;
    this.products[idx] = {
      ...this.products[idx],
      moderationStatus: status,
      moderationReason: reason,
      moderatedAt: new Date().toISOString()
    };
    save(STORAGE_KEYS.PRODUCTS, this.products);
    return this.products[idx];
  }

  addProduct(productData) {
    const defaultSeller = {
      _id: "66f44d5c9e2b1a3d4f8e9b01",
      name: "Kaveri Living",
      storeName: "Kaveri Living",
      location: "Varanasi, India",
      isVerified: true
    };

    const title = productData.title || productData.name || "Handcrafted Heritage Piece";
    const image = productData.image || (Array.isArray(productData.images) ? productData.images[0] : "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80");
    const images = Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [image];

    const newProduct = {
      _id: "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10),
      sku: "SKU-PR-" + Math.floor(1000 + Math.random() * 9000),
      rating: 5.0,
      numReviews: 0,
      moderationStatus: "approved",
      seller: productData.seller || defaultSeller,
      storeId: productData.storeId || defaultSeller._id,
      storeName: productData.storeName || defaultSeller.storeName,
      title,
      name: title,
      image,
      images,
      attributes: {
        origin: productData.attributes?.origin || "Varanasi, Uttar Pradesh",
        material: productData.attributes?.material || "Handcrafted Natural Material",
        craftTime: productData.attributes?.craftTime || "16 artisan hours",
        dimensions: productData.attributes?.dimensions || "Standard Heirloom Edition",
        care: productData.attributes?.care || "Dry clean or clean with damp muslin."
      },
      tags: productData.tags || ["heritage", "handcrafted"],
      ...productData
    };
    this.products.unshift(newProduct);
    save(STORAGE_KEYS.PRODUCTS, this.products);
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    save(STORAGE_KEYS.PRODUCTS, this.products);
    return this.products[idx];
  }

  createProduct(productData) {
    return this.addProduct(productData);
  }

  deleteProduct(id) {
    const idx = this.products.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    save(STORAGE_KEYS.PRODUCTS, this.products);
    return true;
  }

  // ---------- Stores & Guilds ----------
  getStores() {
    return this.stores;
  }

  getStoreById(id) {
    return this.stores.find((s) => s._id === id || s.slug === id) || null;
  }

  updateStore(id, updates) {
    const idx = this.stores.findIndex((s) => s._id === id);
    if (idx === -1) return null;
    this.stores[idx] = { ...this.stores[idx], ...updates };
    save(STORAGE_KEYS.STORES, this.stores);
    return this.stores[idx];
  }

  updateStoreStatus(id, status) {
    const store = this.getStoreById(id);
    if (!store) return null;
    store.status = status;
    save(STORAGE_KEYS.STORES, this.stores);
    return store;
  }

  // ---------- Orders & Escrow Oversight ----------
  getOrders(customerId = null) {
    if (customerId) {
      return this.orders.filter(
        (o) => o.customer?._id === customerId || o.customerId === customerId
      );
    }
    return this.orders;
  }

  getOrdersByCustomerId(customerId) {
    return this.getOrders(customerId);
  }

  getOrderById(id) {
    return this.orders.find((o) => o._id === id || o.orderNumber === id) || null;
  }

  createOrder(orderData) {
    const newOrder = {
      _id: "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10),
      orderNumber: "VY-" + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      paymentStatus: "paid",
      escrowStatus: "held",
      escrowHoldExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      tracking: {
        carrier: "Blue Dart Apex Heritage",
        trackingNumber: "BD" + Math.floor(100000000 + Math.random() * 900000000) + "IN",
        dispatchedAt: null,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        stages: [
          { label: "Commission Received", completed: true, timestamp: "Just now" },
          { label: "Artisan Guild Inspection", completed: false, timestamp: "Pending" },
          { label: "Sealed & Dispatched", completed: false, timestamp: "Pending" },
          { label: "Final Courier Transit", completed: false, timestamp: "Pending" },
          { label: "Delivered to Sanctuary", completed: false, timestamp: "Pending" }
        ]
      },
      ...orderData
    };

    // Deduct stock for ordered products
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach((item) => {
        const prod = this.getProductById(item.productId);
        if (prod && prod.stock >= item.quantity) {
          this.updateProduct(prod._id, { stock: prod.stock - item.quantity });
        }
      });
    }

    this.orders.unshift(newOrder);
    save(STORAGE_KEYS.ORDERS, this.orders);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    save(STORAGE_KEYS.ORDERS, this.orders);
    return order;
  }

  updateOrderEscrowStatus(orderId, escrowStatus, reason = "") {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.escrowStatus = escrowStatus;
    order.escrowOverrideReason = reason;
    order.escrowOverriddenAt = new Date().toISOString();
    save(STORAGE_KEYS.ORDERS, this.orders);
    return order;
  }

  // ---------- Users / Auth ----------
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData) {
    const newUser = {
      _id: "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10),
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
      savedAddresses: [],
      ...userData
    };
    this.users.push(newUser);
    save(STORAGE_KEYS.USERS, this.users);
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    save(STORAGE_KEYS.USERS, this.users);
    return this.users[idx];
  }

  // ---------- Vendor Applications & Cross-Role Activation ----------
  getVendorApplications() {
    return this.vendorApps;
  }

  updateVendorApplication(id, status, justification = "") {
    const app = this.vendorApps.find((a) => a._id === id);
    if (!app) return null;
    app.status = status;
    app.justification = justification;
    app.adjudicatedAt = new Date().toISOString();

    // Cross-role synchronization:
    // If approved, create or activate the vendor's public store and user profile!
    if (status === "approved") {
      const storeSlug = (app.brandName || app.artisanName).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existingStore = this.stores.find((s) => s.slug === storeSlug || s.name.toLowerCase() === (app.brandName || "").toLowerCase());

      let storeId = existingStore?._id;
      if (existingStore) {
        existingStore.isVerified = true;
        existingStore.status = "active";
      } else {
        storeId = "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10);
        const newStore = {
          _id: storeId,
          name: app.brandName || app.artisanName,
          slug: storeSlug,
          tagline: app.description || "Master heritage artisan atelier.",
          description: app.description || "Certified artisan atelier preserving regional GI hand-craft traditions.",
          guild: app.guild || "Textiles & Weaves",
          location: app.region || "Jaipur, Rajasthan",
          bannerImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
          avatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
          masterArtisan: app.artisanName,
          artisanTitle: `Master Artisan (${app.guild})`,
          artisanStory: `Practicing traditional techniques across ${app.experienceYears || 15} years of artisanal mastery.`,
          rating: 5.0,
          reviewsCount: 0,
          salesCount: 0,
          establishedYear: 2026 - (app.experienceYears || 10),
          isVerified: true,
          status: "active",
          badges: ["Council Certified", "GI Tag Certified"],
          contactEmail: app.email,
          contactPhone: app.phone
        };
        this.stores.push(newStore);
      }
      save(STORAGE_KEYS.STORES, this.stores);

      // Also ensure a user account exists with role: "vendor" so they can immediately login
      const existingUser = this.findUserByEmail(app.email);
      if (existingUser) {
        existingUser.role = "vendor";
        existingUser.storeId = storeId;
        existingUser.storeName = app.brandName || app.artisanName;
        save(STORAGE_KEYS.USERS, this.users);
      } else {
        this.createUser({
          name: app.artisanName,
          email: app.email,
          role: "vendor",
          storeId: storeId,
          storeName: app.brandName || app.artisanName
        });
      }
    } else if (status === "rejected") {
      // If rejected, deactivate store if one exists
      const store = this.stores.find((s) => s.name.toLowerCase() === (app.brandName || "").toLowerCase());
      if (store) {
        store.status = "suspended";
        save(STORAGE_KEYS.STORES, this.stores);
      }
    }

    save(STORAGE_KEYS.VENDOR_APPS, this.vendorApps);
    return app;
  }

  // ---------- Platform Settings ----------
  getSettings() {
    return this.settings;
  }

  updateSettings(updates) {
    this.settings = { ...this.settings, ...updates };
    save(STORAGE_KEYS.SETTINGS, this.settings);
    return this.settings;
  }

  // Reset helper
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.STORES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.VENDOR_APPS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.products = [...initialProducts];
    this.stores = [...initialStores];
    this.reviews = [...initialReviews];
    this.orders = [...initialOrders];
    this.users = [...demoUsers];
    this.vendorApps = [...initialVendorApplications];
    this.settings = { ...initialDefaultSettings };
  }
}

export const mockDb = new MockDatabase();
