require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../modules/users/user.model');
const Store = require('../modules/stores/store.model');
const Product = require('../modules/products/product.model');
const Order = require('../modules/orders/order.model');
const VendorApplication = require('../modules/admin/vendorApplication.model');
const Settings = require('../modules/admin/settings.model');

// Seed data
const seedStores = [
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
    name: 'Kaveri Living',
    slug: 'kaveri-living',
    tagline: 'Slow-spun mulberry silk and handloom heirloom textiles from the ghats of Varanasi.',
    description: 'Founded by fifth-generation master weavers, Kaveri Living preserves ancestral pit-loom techniques, cultivating ethical wild silks and botanical indigo vats that breathe timeless Indian heritage into contemporary sanctuaries.',
    guild: 'Textiles & Weaves',
    location: 'Varanasi, Uttar Pradesh',
    bannerImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    masterArtisan: 'Devendra & Shanti Sharma',
    artisanTitle: 'Master Weavers of the Royal Benares Guild',
    artisanStory: 'Every piece passes through thirty-six precise hand gestures, beginning with raw yarn warping in the morning river mist and concluding with hand-twisted golden zari edging.',
    rating: 4.94,
    reviewsCount: 142,
    salesCount: 890,
    establishedYear: 1894,
    isVerified: true,
    status: 'active',
    badges: ['Master Guild 2026', 'GI Tag Certified', 'Fair Wage Certified'],
    contactEmail: 'concierge@kaveriliving.com',
    contactPhone: '+91 542 228 9011',
    socials: { instagram: '@kaveriliving', journal: 'kaveriliving.com/chronicles' },
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b02'),
    name: 'Rooh Jaipur',
    slug: 'rooh-jaipur',
    tagline: 'Heritage wooden block printing and natural madder dyes on hand-spun organic cotton.',
    description: 'Rooh Jaipur collaborates with rural craft clusters across Sanganer and Bagru, transforming sun-bleached river cotton into living tapestries adorned with carved teak motifs.',
    guild: 'Hand-Block Printing',
    location: 'Jaipur, Rajasthan',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    masterArtisan: 'Kailash Chhipa',
    artisanTitle: 'Eighth-Generation Teak Block Carver',
    artisanStory: 'Our colors emerge solely from pomegranate rind, harda seeds, and ferrous alum, ripened under the Thar desert sun.',
    rating: 4.88,
    reviewsCount: 98,
    salesCount: 640,
    establishedYear: 1948,
    isVerified: true,
    status: 'active',
    badges: ['Artisan Guild Council', 'Zero Synthetic Dyes'],
    contactEmail: 'patrons@roohjaipur.com',
    contactPhone: '+91 141 261 4480',
    socials: { instagram: '@roohjaipur' },
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b03'),
    name: 'Nilgiri Botanics',
    slug: 'nilgiri-botanics',
    tagline: 'Wild-harvested cold-distilled ritual oils, resins, and slow-burning temple incense.',
    description: 'Distilled at 7,000 feet in the mist-shrouded Blue Mountains, our therapeutic essences honor centuries of sacred apothecary wisdom using single-origin botanicals.',
    guild: 'Fragrance & Rituals',
    location: 'Ketti Valley, Tamil Nadu',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    masterArtisan: 'Dr. Ananya Nair',
    artisanTitle: 'Botanical Perfumer & Ecologist',
    artisanStory: 'We distill only following the lunar tides, capturing the peak aromatic density of wild eucalyptus, vetiver grass, and forest agarwood.',
    rating: 4.97,
    reviewsCount: 210,
    salesCount: 1450,
    establishedYear: 2012,
    isVerified: true,
    status: 'active',
    badges: ['Cruelty-Free Certified', '100% Wild Crafted'],
    contactEmail: 'alchemy@nilgiribotanics.in',
    contactPhone: '+91 423 244 8920',
    socials: { instagram: '@nilgiribotanics' },
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b04'),
    name: 'Anaya Clay Studio',
    slug: 'anaya-clay',
    tagline: 'High-fire stoneware and burnished terracotta vessels shaped on foot-driven wooden wheels.',
    description: 'Working with riverbed clay and wood-fired kiln glazes, Anaya Clay crafts architectural homeware that celebrates organic wabi-sabi imperfections and earthy warmth.',
    guild: 'Ceramics & Stoneware',
    location: 'Bhuj, Gujarat',
    bannerImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    masterArtisan: 'Radhika Kumbhar',
    artisanTitle: 'Resident Ceramist & Studio Founder',
    artisanStory: 'Each vessel rests in the smoke of tamarind wood for 72 hours, imbuing the clay surface with an unmistakable charcoal patina.',
    rating: 4.91,
    reviewsCount: 115,
    salesCount: 520,
    establishedYear: 2018,
    isVerified: true,
    status: 'active',
    badges: ['Kiln Master Guild', 'Lead-Free Food Safe'],
    contactEmail: 'hello@anayaclay.com',
    contactPhone: '+91 2832 250 119',
    socials: { instagram: '@anayaclay' },
  },
];

const seedProducts = [
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a01'),
    title: 'Hand-Spun Raw Mulberry Silk Throw',
    name: 'Hand-Spun Raw Mulberry Silk Throw',
    subtitle: 'Woven on ancestral wooden pit-looms in Varanasi with subtle selvage fringe',
    description: 'An extraordinary heirloom textile created from unbleached wild mulberry silk, retaining its natural golden lustre and tactile organic slubs. Draped effortlessly over a chair or foot of the bed, this piece radiates subtle opulence and thermal elegance through all seasons.',
    price: 18500,
    originalPrice: 22000,
    category: 'Textiles & Weaves',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 7,
    rating: 4.9,
    numReviews: 48,
    isFeatured: true,
    isGiCertified: true,
    moderationStatus: 'approved',
    sku: 'VYR-KVR-A01',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
      name: 'Kaveri Living',
      storeName: 'Kaveri Living',
      location: 'Varanasi, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
    storeName: 'Kaveri Living',
    attributes: {
      origin: 'Varanasi, Uttar Pradesh',
      material: '100% Wild Mulberry Silk',
      craftTime: '38 artisan hours',
      dimensions: '140 cm x 210 cm',
      care: 'Dry clean only. Store wrapped in breathable unbleached muslin.',
    },
    tags: ['textiles', 'silk', 'handloom', 'featured', 'slow-craft'],
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a02'),
    title: 'Terracotta Sculptural Amphora Vase',
    name: 'Terracotta Sculptural Amphora Vase',
    subtitle: 'Hand-thrown river clay burnished with smooth river stones and wood ash glaze',
    description: 'This monumental amphora vase features asymmetric twin handles inspired by Mediterranean antiquity and Indus Valley archaeological excavations. The surface showcases deep earthy nuances achieved exclusively through wood smoke reduction.',
    price: 9200,
    originalPrice: 11500,
    category: 'Ceramics & Stoneware',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 12,
    rating: 4.8,
    numReviews: 32,
    isFeatured: true,
    isGiCertified: false,
    moderationStatus: 'approved',
    sku: 'VYR-ANY-002',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b04'),
      name: 'Anaya Clay Studio',
      storeName: 'Anaya Clay Studio',
      location: 'Bhuj, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b04'),
    storeName: 'Anaya Clay Studio',
    attributes: {
      origin: 'Kutch, Gujarat',
      material: 'Burnished River Terracotta',
      craftTime: '16 hours + 3 days firing',
      dimensions: 'Height: 38 cm | Diameter: 24 cm',
      care: 'Wipe with damp cotton cloth. Watertight interior glazed with beeswax.',
    },
    tags: ['ceramics', 'terracotta', 'vessels', 'living', 'featured'],
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a03'),
    title: 'Hand-Carved Walnut Wood Credenza Tray',
    name: 'Hand-Carved Walnut Wood Credenza Tray',
    subtitle: 'Kashmir walnut timber sculpted with traditional lattice jali relief borders',
    description: 'Carved from single-slab seasoned walnut wood harvested in the Kashmir valley, this serving tray showcases intricate hand-chiseled geometric lattice borders that cast mesmerizing shadow plays across dining surfaces.',
    price: 14200,
    originalPrice: 16000,
    category: 'Woodcraft & Furniture',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 5,
    rating: 4.95,
    numReviews: 24,
    isFeatured: true,
    isGiCertified: true,
    moderationStatus: 'approved',
    sku: 'VYR-KVR-W03',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
      name: 'Kaveri Living',
      storeName: 'Kaveri Living',
      location: 'Varanasi, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
    storeName: 'Kaveri Living',
    attributes: {
      origin: 'Srinagar, Jammu & Kashmir',
      material: 'Seasoned Kashmiri Walnut Wood',
      craftTime: '26 artisan hours',
      dimensions: '52 cm x 34 cm x 5 cm',
      care: 'Condition semi-annually with natural walnut oil. Avoid direct submersion.',
    },
    tags: ['woodcraft', 'carved', 'walnut', 'living', 'featured'],
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a04'),
    title: 'Botanical Indigo Hand-Block Quilt',
    name: 'Botanical Indigo Hand-Block Quilt',
    subtitle: 'Triple-layer cambric cotton batting stamped with ancestral Dabu mud-resist blocks',
    description: 'Crafted in Bagru by master block printers, this heirloom razai quilt features five subtle tonal shades of pure natural indigo. Hand-quilted with micro kantha running stitches that deliver clouds of breathable, lightweight warmth.',
    price: 16800,
    originalPrice: 19500,
    category: 'Textiles & Weaves',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 9,
    rating: 4.87,
    numReviews: 41,
    isFeatured: true,
    isGiCertified: true,
    moderationStatus: 'approved',
    sku: 'VYR-ROH-004',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b02'),
      name: 'Rooh Jaipur',
      storeName: 'Rooh Jaipur',
      location: 'Jaipur, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b02'),
    storeName: 'Rooh Jaipur',
    attributes: {
      origin: 'Bagru, Rajasthan',
      material: '100% Organic Desi Cotton & Indigo Dye',
      craftTime: '45 artisan hours',
      dimensions: '220 cm x 270 cm (King Size)',
      care: 'Gentle machine wash cold with pH-neutral detergent. Dry in deep shade.',
    },
    tags: ['textiles', 'quilt', 'indigo', 'blockprint', 'featured'],
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a05'),
    title: 'Hand-Hammered Solid Brass Ritual Diya',
    name: 'Hand-Hammered Solid Brass Ritual Diya',
    subtitle: 'Heavy gauge recycled temple brass hand-spun and polished with tamarind paste',
    description: 'An evocative sculptural oil lamp that celebrates sacred sanctuary lighting. Hand-beaten by hereditary coppersmiths using age-old sand casting and hammer embossing methods, developing a rich antiqued golden sheen.',
    price: 6400,
    originalPrice: 7800,
    category: 'Living & Decor',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 18,
    rating: 4.79,
    numReviews: 53,
    isFeatured: false,
    isGiCertified: false,
    moderationStatus: 'approved',
    sku: 'VYR-ANY-005',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b04'),
      name: 'Anaya Clay Studio',
      storeName: 'Anaya Clay Studio',
      location: 'Bhuj, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b04'),
    storeName: 'Anaya Clay Studio',
    attributes: {
      origin: 'Moradabad, Uttar Pradesh',
      material: 'Recycled Temple Brass',
      craftTime: '12 artisan hours',
      dimensions: 'Height: 18 cm | Diameter: 14 cm',
      care: 'Polish with lemon and salt or Pitambari powder for bright lustre.',
    },
    tags: ['brass', 'rituals', 'lighting', 'decor'],
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a08'),
    title: 'Hand-Woven Pashmina Cashmere Stole',
    name: 'Hand-Woven Pashmina Cashmere Stole',
    subtitle: 'Sub-15 micron Changthangi cashmere woven with traditional sozni needlework',
    description: 'Spun from the finest underfleece of high-altitude Himalayan goats, this gossamer stole is so featherweight it glides through a signet ring. Accented with miniature needle embroidery depicting chinar leaves.',
    price: 26500,
    originalPrice: 32000,
    category: 'Textiles & Weaves',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 4,
    rating: 4.98,
    numReviews: 19,
    isFeatured: true,
    isGiCertified: true,
    moderationStatus: 'approved',
    sku: 'VYR-KVR-P08',
    seller: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
      name: 'Kaveri Living',
      storeName: 'Kaveri Living',
      location: 'Varanasi, India',
      isVerified: true,
    },
    storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
    storeName: 'Kaveri Living',
    attributes: {
      origin: 'Changthang & Srinagar, Kashmir',
      material: '100% Authentic Handspun Pashmina Cashmere',
      craftTime: '120 artisan hours',
      dimensions: '70 cm x 200 cm',
      care: 'Professional cashmere dry clean only. Cedar ball storage recommended.',
    },
    tags: ['cashmere', 'pashmina', 'textiles', 'luxury', 'featured'],
  },
];

const seedOrders = [
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9e01'),
    orderNumber: 'VYR-884219',
    createdAt: new Date('2026-09-20T10:15:00Z'),
    status: 'dispatched',
    paymentStatus: 'paid',
    escrowStatus: 'secured',
    customer: {
      _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9c01'),
      name: 'Aria Thorne',
      email: 'customer@veyra.com',
      phone: '+91 98201 44520',
    },
    shippingAddress: {
      name: 'Aria Thorne',
      addressLine1: '42 Altamount Road, Horizon Residence 14B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      country: 'India',
      phone: '+91 98201 44520',
    },
    items: [
      {
        productId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a01'),
        title: 'Hand-Spun Raw Mulberry Silk Throw',
        price: 18500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
        storeName: 'Kaveri Living',
        storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
      },
    ],
    pricing: {
      subtotal: 18500,
      shipping: 0,
      tax: 2220,
      discount: 0,
      total: 20720,
    },
    totalAmount: 20720,
    tracking: {
      carrier: 'Blue Dart Apex Heritage',
      trackingNumber: 'BD992841920IN',
      dispatchedAt: new Date('2026-09-21T14:30:00Z'),
      estimatedDelivery: new Date('2026-09-26T18:00:00Z'),
      stages: [
        { label: 'Commission Received', completed: true, timestamp: '20 Sep 2026, 10:15 AM' },
        { label: 'Artisan Guild Inspection', completed: true, timestamp: '21 Sep 2026, 11:00 AM' },
        { label: 'Sealed & Dispatched', completed: true, timestamp: '21 Sep 2026, 02:30 PM' },
        { label: 'Final Courier Transit', completed: false, timestamp: 'In transit to Mumbai' },
        { label: 'Delivered to Sanctuary', completed: false, timestamp: 'Est. 26 Sep 2026' },
      ],
    },
  },
];

const seedVendorApplications = [
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a91'),
    artisanName: 'Ghulam Nabi',
    brandName: 'Kashmir Loom Masters',
    email: 'ghulam@kashmirlooms.org',
    phone: '+91 94190 28192',
    guild: 'Textiles & Weaves',
    region: 'Srinagar, J&K',
    craftCluster: 'Pashmina & Kani Weaves',
    experienceYears: 28,
    gstin: '01AABCK9921E1Z3',
    giCode: 'GI-7401-JK',
    pehchanId: 'PEH-7401-SRN',
    bankVerified: true,
    bankName: 'J&K Bank (Srinagar Main)',
    workshopFootprint: '14 Traditional Pit Looms, 32 Registered Master Weavers',
    description: 'Centuries-old kani needlework and charkha spun Changthangi pashmina shawls with zero synthetic blends.',
    status: 'pending',
    priority: 'high',
    appliedAt: new Date('2026-09-25T15:20:00Z'),
  },
  {
    _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9a92'),
    artisanName: 'R. Sharma',
    brandName: 'Moradabad Brass Artisan Co-op',
    email: 'sharma@moradabadbrass.in',
    phone: '+91 591 249 1102',
    guild: 'Metalware & Brass',
    region: 'Moradabad, UP',
    craftCluster: 'Cast Brass & Bell Metal',
    experienceYears: 22,
    gstin: '09AAACR4412B1Z8',
    giCode: 'GI-UP-210',
    pehchanId: 'PEH-9921-MB',
    bankVerified: true,
    bankName: 'State Bank of India (Brass Market)',
    workshopFootprint: '8 Coal & Gas Kiln Crucibles, 45 Metal Crafters',
    description: 'Hand-chiseled sand casting, lost-wax brass lamps, and traditional bell metal vessels.',
    status: 'pending',
    priority: 'medium',
    appliedAt: new Date('2026-09-25T12:00:00Z'),
  },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas ZalimaEco...');
    await mongoose.connect(uri);
    console.log(`Connected to: ${mongoose.connection.name}`);

    // Clean existing data for clean idempotent seed
    await Promise.all([
      User.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      VendorApplication.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('Cleaned existing collections.');

    // Seed Stores
    await Store.insertMany(seedStores);
    console.log(`Seeded ${seedStores.length} stores.`);

    // Seed Products
    await Product.insertMany(seedProducts);
    console.log(`Seeded ${seedProducts.length} products.`);

    // Seed Orders
    await Order.insertMany(seedOrders);
    console.log(`Seeded ${seedOrders.length} orders.`);

    // Seed Applications
    await VendorApplication.insertMany(seedVendorApplications);
    console.log(`Seeded ${seedVendorApplications.length} vendor applications.`);

    // Seed Settings
    await Settings.create({ key: 'global_settings' });
    console.log('Seeded global platform settings.');

    // Seed Users with hashed passwords
    const customerPassword = await bcrypt.hash('password123', 10);
    const vendorPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = [
      {
        _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9c01'),
        name: 'Aria Thorne',
        email: 'customer@veyra.com',
        password: customerPassword,
        role: 'customer',
        phone: '+91 98201 44520',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        savedAddresses: [
          {
            _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9f01'),
            label: 'Primary Sanctuary',
            isDefault: true,
            name: 'Aria Thorne',
            phone: '+91 98201 44520',
            addressLine1: '42 Altamount Road, Horizon Residence 14B',
            addressLine2: 'Opposite Cumballa Hill Club',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400026',
            country: 'India',
          },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9c02'),
        name: 'Devendra Sharma',
        email: 'artisan@kaveri.com',
        password: vendorPassword,
        role: 'vendor',
        phone: '+91 542 228 9011',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        storeId: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9b01'),
        storeName: 'Kaveri Living',
      },
      {
        _id: new mongoose.Types.ObjectId('66f44d5c9e2b1a3d4f8e9c03'),
        name: 'Elena Rostova',
        email: 'admin@veyra.com',
        password: adminPassword,
        role: 'admin',
        phone: '+91 11 4400 9000',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        adminLevel: 'Super Administrator',
      },
    ];

    await User.insertMany(users);
    console.log(`Seeded ${users.length} authenticated users (Customer, Vendor, Admin).`);

    console.log('✅ Database ZalimaEco seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
