// VEYRA Mock Database Seed Data
// Realistic interconnected entities with 24-character hexadecimal MongoDB ObjectIds

export const initialStores = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9b01",
    name: "Kaveri Living",
    slug: "kaveri-living",
    tagline: "Slow-spun mulberry silk and handloom heirloom textiles from the ghats of Varanasi.",
    description: "Founded by fifth-generation master weavers, Kaveri Living preserves ancestral pit-loom techniques, cultivating ethical wild silks and botanical indigo vats that breathe timeless Indian heritage into contemporary sanctuaries.",
    guild: "Textiles & Weaves",
    location: "Varanasi, Uttar Pradesh",
    bannerImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    avatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    masterArtisan: "Devendra & Shanti Sharma",
    artisanTitle: "Master Weavers of the Royal Benares Guild",
    artisanStory: "Every piece passes through thirty-six precise hand gestures, beginning with raw yarn warping in the morning river mist and concluding with hand-twisted golden zari edging.",
    rating: 4.94,
    reviewsCount: 142,
    salesCount: 890,
    establishedYear: 1894,
    isVerified: true,
    status: "active",
    badges: ["Master Guild 2026", "GI Tag Certified", "Fair Wage Certified"],
    contactEmail: "concierge@kaveriliving.com",
    contactPhone: "+91 542 228 9011",
    socials: { instagram: "@kaveriliving", journal: "kaveriliving.com/chronicles" }
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9b02",
    name: "Rooh Jaipur",
    slug: "rooh-jaipur",
    tagline: "Heritage wooden block printing and natural madder dyes on hand-spun organic cotton.",
    description: "Rooh Jaipur collaborates with rural craft clusters across Sanganer and Bagru, transforming sun-bleached river cotton into living tapestries adorned with carved teak motifs.",
    guild: "Hand-Block Printing",
    location: "Jaipur, Rajasthan",
    bannerImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    masterArtisan: "Kailash Chhipa",
    artisanTitle: "Eighth-Generation Teak Block Carver",
    artisanStory: "Our colors emerge solely from pomegranate rind, harda seeds, and ferrous alum, ripened under the Thar desert sun.",
    rating: 4.88,
    reviewsCount: 98,
    salesCount: 640,
    establishedYear: 1948,
    isVerified: true,
    status: "active",
    badges: ["Artisan Guild Council", "Zero Synthetic Dyes"],
    contactEmail: "patrons@roohjaipur.com",
    contactPhone: "+91 141 261 4480",
    socials: { instagram: "@roohjaipur" }
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9b03",
    name: "Nilgiri Botanics",
    slug: "nilgiri-botanics",
    tagline: "Wild-harvested cold-distilled ritual oils, resins, and slow-burning temple incense.",
    description: "Distilled at 7,000 feet in the mist-shrouded Blue Mountains, our therapeutic essences honor centuries of sacred apothecary wisdom using single-origin botanicals.",
    guild: "Fragrance & Rituals",
    location: "Ketti Valley, Tamil Nadu",
    bannerImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    avatarImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    masterArtisan: "Dr. Ananya Nair",
    artisanTitle: "Botanical Perfumer & Ecologist",
    artisanStory: "We distill only following the lunar tides, capturing the peak aromatic density of wild eucalyptus, vetiver grass, and forest agarwood.",
    rating: 4.97,
    reviewsCount: 210,
    salesCount: 1450,
    establishedYear: 2012,
    isVerified: true,
    status: "active",
    badges: ["Cruelty-Free Certified", "100% Wild Crafted"],
    contactEmail: "alchemy@nilgiribotanics.in",
    contactPhone: "+91 423 244 8920",
    socials: { instagram: "@nilgiribotanics" }
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9b04",
    name: "Anaya Clay Studio",
    slug: "anaya-clay",
    tagline: "High-fire stoneware and burnished terracotta vessels shaped on foot-driven wooden wheels.",
    description: "Working with riverbed clay and wood-fired kiln glazes, Anaya Clay crafts architectural homeware that celebrates organic wabi-sabi imperfections and earthy warmth.",
    guild: "Ceramics & Stoneware",
    location: "Bhuj, Gujarat",
    bannerImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    masterArtisan: "Radhika Kumbhar",
    artisanTitle: "Resident Ceramist & Studio Founder",
    artisanStory: "Each vessel rests in the smoke of tamarind wood for 72 hours, imbuing the clay surface with an unmistakable charcoal patina.",
    rating: 4.91,
    reviewsCount: 115,
    salesCount: 520,
    establishedYear: 2018,
    isVerified: true,
    status: "active",
    badges: ["Kiln Master Guild", "Lead-Free Food Safe"],
    contactEmail: "hello@anayaclay.com",
    contactPhone: "+91 2832 250 119",
    socials: { instagram: "@anayaclay" }
  }
];

export const initialProducts = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9a01",
    title: "Hand-Spun Raw Mulberry Silk Throw",
    subtitle: "Woven on ancestral wooden pit-looms in Varanasi with subtle selvage fringe",
    description: "An extraordinary heirloom textile created from unbleached wild mulberry silk, retaining its natural golden lustre and tactile organic slubs. Draped effortlessly over a chair or foot of the bed, this piece radiates subtle opulence and thermal elegance through all seasons.",
    price: 18500,
    originalPrice: 22000,
    category: "Textiles & Weaves",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 7,
    rating: 4.9,
    numReviews: 48,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b01",
      name: "Kaveri Living",
      storeName: "Kaveri Living",
      location: "Varanasi, India",
      isVerified: true
    },
    attributes: {
      origin: "Varanasi, Uttar Pradesh",
      material: "100% Wild Mulberry Silk",
      craftTime: "38 artisan hours",
      dimensions: "140 cm x 210 cm",
      care: "Dry clean only. Store wrapped in breathable unbleached muslin."
    },
    tags: ["textiles", "silk", "handloom", "featured", "slow-craft"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a02",
    title: "Terracotta Sculptural Amphora Vase",
    subtitle: "Hand-thrown river clay burnished with smooth river stones and wood ash glaze",
    description: "This monumental amphora vase features asymmetric twin handles inspired by Mediterranean antiquity and Indus Valley archaeological excavations. The surface showcases deep earthy nuances achieved exclusively through wood smoke reduction.",
    price: 9200,
    originalPrice: 11500,
    category: "Ceramics & Pottery",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 12,
    rating: 4.8,
    numReviews: 32,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b04",
      name: "Anaya Clay Studio",
      storeName: "Anaya Clay Studio",
      location: "Bhuj, India",
      isVerified: true
    },
    attributes: {
      origin: "Kutch, Gujarat",
      material: "Burnished River Terracotta",
      craftTime: "16 hours + 3 days firing",
      dimensions: "Height: 38 cm | Diameter: 24 cm",
      care: "Wipe with damp cotton cloth. Watertight interior glazed with beeswax."
    },
    tags: ["ceramics", "terracotta", "vessels", "living", "featured"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a03",
    title: "Hand-Carved Walnut Wood Credenza Tray",
    subtitle: "Kashmir walnut timber sculpted with traditional lattice jali relief borders",
    description: "Carved from single-slab seasoned walnut wood harvested in the Kashmir valley, this serving tray showcases intricate hand-chiseled geometric lattice borders that cast mesmerizing shadow plays across dining and cocktail surfaces.",
    price: 14200,
    originalPrice: 16000,
    category: "Woodcraft & Furniture",
    images: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 5,
    rating: 4.95,
    numReviews: 24,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b01",
      name: "Kaveri Living",
      storeName: "Kaveri Living",
      location: "Varanasi, India",
      isVerified: true
    },
    attributes: {
      origin: "Srinagar, Jammu & Kashmir",
      material: "Seasoned Kashmiri Walnut Wood",
      craftTime: "26 artisan hours",
      dimensions: "52 cm x 34 cm x 5 cm",
      care: "Condition semi-annually with natural walnut oil. Avoid direct submersion."
    },
    tags: ["woodcraft", "carved", "walnut", "living", "featured"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a04",
    title: "Botanical Indigo Hand-Block Quilt",
    subtitle: "Triple-layer cambric cotton batting stamped with ancestral Dabu mud-resist blocks",
    description: "Crafted in Bagru by master block printers, this heirloom razai quilt features five subtle tonal shades of pure natural indigo. Hand-quilted with micro kantha running stitches that deliver clouds of breathable, lightweight warmth.",
    price: 16800,
    originalPrice: 19500,
    category: "Textiles & Weaves",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 9,
    rating: 4.87,
    numReviews: 41,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b02",
      name: "Rooh Jaipur",
      storeName: "Rooh Jaipur",
      location: "Jaipur, India",
      isVerified: true
    },
    attributes: {
      origin: "Bagru, Rajasthan",
      material: "100% Organic Desi Cotton & Indigo Dye",
      craftTime: "45 artisan hours",
      dimensions: "220 cm x 270 cm (King Size)",
      care: "Gentle machine wash cold with pH-neutral detergent. Dry in deep shade."
    },
    tags: ["textiles", "quilt", "indigo", "blockprint", "featured"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a05",
    title: "Hand-Hammered Solid Brass Ritual Diya",
    subtitle: "Heavy gauge recycled temple brass hand-spun and polished with tamarind paste",
    description: "An evocative sculptural oil lamp that celebrates sacred sanctuary lighting. Hand-beaten by hereditary coppersmiths using age-old sand casting and hammer embossing methods, developing a rich antiqued golden sheen.",
    price: 6400,
    originalPrice: 7800,
    category: "Living & Decor",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 18,
    rating: 4.79,
    numReviews: 53,
    isFeatured: false,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b01",
      name: "Kaveri Living",
      storeName: "Kaveri Living",
      location: "Varanasi, India",
      isVerified: true
    },
    attributes: {
      origin: "Moradabad, Uttar Pradesh",
      material: "Solid Virgin Brass",
      craftTime: "12 artisan hours",
      dimensions: "Diameter: 22 cm | Height: 8 cm | Weight: 1.8 kg",
      care: "Clean with lemon slice or brass polishing paste to restore mirror glow."
    },
    tags: ["brass", "decor", "ritual", "lighting"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a06",
    title: "Aged Sandalwood & Wild Rose Temple Incense",
    subtitle: "Cold-pressed temple flower powders, Mysore sandalwood dust and halmaddi resin",
    description: "Hand-rolled without toxic burning agents or bamboo cores. Formulated from consecrated dried temple blossoms, sweet forest halmaddi resin, and authentic Mysore white sandalwood shavings for deep meditative calm.",
    price: 3200,
    originalPrice: 3800,
    category: "Fragrance & Rituals",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 45,
    rating: 4.96,
    numReviews: 89,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b03",
      name: "Nilgiri Botanics",
      storeName: "Nilgiri Botanics",
      location: "Nilgiris, India",
      isVerified: true
    },
    attributes: {
      origin: "Ketti Valley, Tamil Nadu",
      material: "Pure Sandalwood Shavings & Sacred Resins",
      craftTime: "Small batch 14-day cure",
      dimensions: "Box of 40 luxury sticks (60 mins burn each)",
      care: "Keep in a cool dry drawer away from excessive humidity."
    },
    tags: ["fragrance", "incense", "ritual", "sandalwood"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a07",
    title: "Hammered Pure Copper Water Carafe & Tumbler",
    subtitle: "Ayurvedic vessel hand-chiseled from pure electrolytic copper sheet",
    description: "Honoring the ancient Ayurvedic ritual of Tamra Jal, this sculpted carafe and nesting tumbler set is hand-hammered to maximize surface contact, naturally ionising and cooling drinking water overnight.",
    price: 5800,
    originalPrice: 6900,
    category: "Living & Decor",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 22,
    rating: 4.85,
    numReviews: 37,
    isFeatured: false,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b04",
      name: "Anaya Clay Studio",
      storeName: "Anaya Clay Studio",
      location: "Bhuj, India",
      isVerified: true
    },
    attributes: {
      origin: "Tambat Ali, Pune",
      material: "99.8% Pure Food-Grade Copper",
      craftTime: "14 artisan hours",
      dimensions: "Carafe: 1000 ml | Tumbler: 280 ml",
      care: "Rinse inside with salt and tamarind pulp once weekly. Do not refrigerate."
    },
    tags: ["copper", "ayurveda", "drinkware", "living"]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9a08",
    title: "Hand-Woven Pashmina Cashmere Stole",
    subtitle: "Sub-15 micron Changthangi cashmere woven with traditional sozni needlework",
    description: "Spun from the finest underfleece of high-altitude Himalayan goats, this gossamer stole is so featherweight it glides through a signet ring. Accented with miniature needle embroidery depicting chinar leaves.",
    price: 26500,
    originalPrice: 32000,
    category: "Textiles & Weaves",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 4,
    rating: 4.98,
    numReviews: 19,
    isFeatured: true,
    seller: {
      _id: "66f44d5c9e2b1a3d4f8e9b01",
      name: "Kaveri Living",
      storeName: "Kaveri Living",
      location: "Varanasi, India",
      isVerified: true
    },
    attributes: {
      origin: "Changthang & Srinagar, Kashmir",
      material: "100% Authentic Handspun Pashmina Cashmere",
      craftTime: "120 artisan hours",
      dimensions: "70 cm x 200 cm",
      care: "Professional cashmere dry clean only. Cedar ball storage recommended."
    },
    tags: ["cashmere", "pashmina", "textiles", "luxury", "featured"]
  }
].map((p) => ({
  ...p,
  name: p.title,
  image: p.images?.[0] || "",
  storeName: p.seller?.storeName || p.seller?.name || "Artisan Atelier",
  storeId: p.seller?._id || "",
}));

export const initialReviews = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9d01",
    productId: "66f44d5c9e2b1a3d4f8e9a01",
    author: "Meera Sen",
    rating: 5,
    date: "14 Sep 2026",
    verifiedPurchase: true,
    title: "An heirloom textile that breathes serenity into our home",
    comment: "The weight and drape of this raw mulberry silk throw is utterly unmatched. You can feel the heartbeat of the loom in the subtle texture variations. Arrived wrapped in botanical tissue with an artisan card."
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9d02",
    productId: "66f44d5c9e2b1a3d4f8e9a01",
    author: "Julian Vance",
    rating: 5,
    date: "02 Sep 2026",
    verifiedPurchase: true,
    title: "Exceptional craftsmanship and swift provenance verification",
    comment: "Bought as an anniversary gift. The natural golden sheen of unbleached silk shifts beautifully under morning natural light. VEYRA's artisan packaging felt like receiving museum-grade heritage."
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9d03",
    productId: "66f44d5c9e2b1a3d4f8e9a02",
    author: "Kavita Rao",
    rating: 5,
    date: "28 Aug 2026",
    verifiedPurchase: true,
    title: "A stunning architectural centerpiece",
    comment: "The terracotta finish has a smoky depth you simply cannot capture in photographs. It stands proudly on our credenza and garners compliments from every guest."
  }
];

export const initialOrders = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9e01",
    orderNumber: "VYR-884219",
    createdAt: "2026-09-20T10:15:00Z",
    status: "dispatched",
    paymentStatus: "paid",
    customer: {
      _id: "66f44d5c9e2b1a3d4f8e9c01",
      name: "Aria Thorne",
      email: "customer@veyra.com",
      phone: "+91 98201 44520"
    },
    shippingAddress: {
      name: "Aria Thorne",
      addressLine1: "42 Altamount Road, Horizon Residence 14B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400026",
      country: "India",
      phone: "+91 98201 44520"
    },
    items: [
      {
        productId: "66f44d5c9e2b1a3d4f8e9a01",
        title: "Hand-Spun Raw Mulberry Silk Throw",
        price: 18500,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
        storeName: "Kaveri Living",
        storeId: "66f44d5c9e2b1a3d4f8e9b01"
      }
    ],
    pricing: {
      subtotal: 18500,
      shipping: 0,
      tax: 2220,
      discount: 0,
      total: 20720
    },
    tracking: {
      carrier: "Blue Dart Apex Heritage",
      trackingNumber: "BD992841920IN",
      dispatchedAt: "2026-09-21T14:30:00Z",
      estimatedDelivery: "2026-09-26T18:00:00Z",
      stages: [
        { label: "Commission Received", completed: true, timestamp: "20 Sep 2026, 10:15 AM" },
        { label: "Artisan Guild Inspection", completed: true, timestamp: "21 Sep 2026, 11:00 AM" },
        { label: "Sealed & Dispatched", completed: true, timestamp: "21 Sep 2026, 02:30 PM" },
        { label: "Final Courier Transit", completed: false, timestamp: "In transit to Mumbai" },
        { label: "Delivered to Sanctuary", completed: false, timestamp: "Est. 26 Sep 2026" }
      ]
    }
  }
];

export const demoUsers = [
  {
    _id: "66f44d5c9e2b1a3d4f8e9c01",
    name: "Aria Thorne",
    email: "customer@veyra.com",
    role: "customer",
    token: "mock-jwt-token-customer-veyra-2026",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+91 98201 44520",
    savedAddresses: [
      {
        _id: "66f44d5c9e2b1a3d4f8e9f01",
        label: "Primary Sanctuary",
        isDefault: true,
        name: "Aria Thorne",
        phone: "+91 98201 44520",
        addressLine1: "42 Altamount Road, Horizon Residence 14B",
        addressLine2: "Opposite Cumballa Hill Club",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400026",
        country: "India"
      },
      {
        _id: "66f44d5c9e2b1a3d4f8e9f02",
        label: "Weekend Atelier",
        isDefault: false,
        name: "Aria Thorne",
        phone: "+91 98201 44520",
        addressLine1: "Villa Bougainvillea, Chhatodi Lane",
        addressLine2: "Zuari Riverside",
        city: "Aldona",
        state: "Goa",
        pincode: "403508",
        country: "India"
      }
    ]
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9c02",
    name: "Devendra Sharma",
    email: "artisan@kaveri.com",
    role: "vendor",
    token: "mock-jwt-token-vendor-kaveri-2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    phone: "+91 542 228 9011",
    storeId: "66f44d5c9e2b1a3d4f8e9b01",
    storeName: "Kaveri Living"
  },
  {
    _id: "66f44d5c9e2b1a3d4f8e9c03",
    name: "Elena Rostova",
    email: "admin@veyra.com",
    role: "admin",
    token: "mock-jwt-token-admin-veyra-2026",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    phone: "+91 11 4400 9000",
    adminLevel: "Super Administrator"
  }
];
