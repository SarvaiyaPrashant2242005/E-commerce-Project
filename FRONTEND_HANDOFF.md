# VEYRA Frontend-to-Backend Integration & API Handoff Guide

This document specifies the architecture, API contracts, payload shapes, authentication expectations, and integration steps required to connect VEYRA's completed React frontend with the real Express.js/MongoDB backend.

---

## 1. Architectural Foundation

### A. Centralized API Service Layer
All network communications originate from `src/api/client.js` (an Axios instance with automatic JWT header injection and response normalization) and dedicated domain services:
- `src/api/vendor.api.js`: Merchant workspace (metrics, inventory, orders, analytics, store profile).
- `src/api/products.api.js`: Public catalog & CRUD operations.
- `src/api/orders.api.js`: Customer checkout, order history & status tracking.
- `src/api/stores.api.js`: Atelier directory, public storefronts & onboarding.
- `src/api/auth.api.js`: Customer & merchant authentication and saved sanctuaries.
- `src/api/admin.api.js`: Multi-tenant governance and moderation.

### B. Standardized Response Envelope
The frontend unwraps responses adhering to the following unified JSON schema:

```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

*Note:* If an error occurs, the backend must return:
```json
{
  "success": false,
  "errorCode": "UNAUTHORIZED_STORE_ACCESS",
  "errorMessage": "You do not hold permission to modify this atelier's products.",
  "messageToShow": "You do not hold permission to modify this atelier's products."
}
```

### C. Mock Mode Switch (`msw`)
- **Development Mock Mode:** Controlled by `.env.development` (`VITE_USE_MOCK_API=true`). Handlers in `src/mocks/` intercept network traffic in the browser via Service Worker.
- **Production / Real API Mode:** Set `VITE_USE_MOCK_API=false` in `.env.development` or run `npm run build` with `.env.production` (`VITE_USE_MOCK_API=false`). In real mode, requests route directly to the backend base URL defined in `VITE_API_BASE_URL` (default: `http://localhost:5000/api`).

---

## 2. Vendor Workspace API Endpoint Contracts (Phase 4C)

All `/api/vendor/*` routes require an authenticated HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

### 1. `GET /api/vendor/metrics`
Retrieves operational overview KPIs for the logged-in artisan.
- **Authorization:** `role === "vendor"`, scoped to `req.user.storeId`.
- **Response Shape (`data`):**
```json
{
  "grossMerchandiseVolume": 142890,
  "growthRate": 18.4,
  "totalOrders": 38,
  "averageOrderValue": 3760,
  "conversionRate": 4.82,
  "activeCatalogCount": 12,
  "kilnLoomCount": 3,
  "draftListingCount": 2,
  "pendingFulfillmentCount": 5,
  "urgentDispatchCount": 2,
  "nextEscrowPayout": {
    "amount": 48250,
    "scheduledDate": "Tomorrow, 10:00 AM IST",
    "holdPolicy": "48-hour patron craft inspection"
  },
  "lowStockAlerts": 1,
  "recentOrders": [ ... ]
}
```

---

### 2. `GET /api/vendor/products`
Retrieves all handcrafted products cataloged under the vendor's atelier.
- **Query Parameters:** `?page=1&limit=50&category=...&stockStatus=...`
- **Response Shape (`data`):**
```json
[
  {
    "_id": "66f44d5c9e2b1a3d4f8e9a01",
    "title": "Hand-Spun Raw Mulberry Silk Throw",
    "name": "Hand-Spun Raw Mulberry Silk Throw",
    "subtitle": "Spun on traditional pit-looms in the ghats of Varanasi",
    "description": "Ancestral unbleached golden silk...",
    "category": "Textiles & Weaves",
    "price": 18500,
    "originalPrice": 22000,
    "stock": 14,
    "image": "https://images.unsplash.com/photo-...",
    "images": ["https://images.unsplash.com/photo-..."],
    "seller": {
      "_id": "66f44d5c9e2b1a3d4f8e9b01",
      "name": "Kaveri Living",
      "storeName": "Kaveri Living",
      "location": "Varanasi, Uttar Pradesh",
      "isVerified": true
    },
    "attributes": {
      "origin": "Varanasi, Uttar Pradesh",
      "material": "100% Wild Mulberry Silk",
      "craftTime": "48 artisan hours",
      "dimensions": "140 cm × 220 cm",
      "care": "Professional dry clean with cedar ball storage"
    },
    "isGiCertified": true
  }
]
```

---

### 3. `POST /api/products` (Vendor Product Creation)
Catalogs a new craft piece associated with the vendor's store.
- **Request Payload:**
```json
{
  "title": "Kansa Dining Thali Set — Bell Metal",
  "name": "Kansa Dining Thali Set — Bell Metal",
  "subtitle": "Solid hand-beaten bronze alloy thali with 4 katori bowls",
  "description": "Hand-hammered from pure virgin copper and tin according to Ayurvedic metallurgy...",
  "category": "Brass & Bell Metal",
  "price": 4850,
  "originalPrice": 5900,
  "stock": 10,
  "image": "https://images.unsplash.com/photo-...",
  "images": ["https://images.unsplash.com/photo-..."],
  "isGiCertified": true,
  "attributes": {
    "origin": "Moradabad, Uttar Pradesh",
    "material": "Food-Grade Bronze (78% Copper, 22% Tin)",
    "craftTime": "18 artisan hours",
    "dimensions": "Diameter: 30 cm | Bowls: 150 ml each",
    "care": "Wash with tamarind and salt. Avoid harsh synthetic detergents."
  }
}
```
- **Backend Responsibility:**
  - Auto-assign `seller._id = req.user.storeId` and `storeName = req.user.storeName`.
  - Prevent vendors from assigning products to stores they do not own.

---

### 4. `PUT /api/products/:id` (Vendor Product Update)
Updates product attributes, inventory counts, or pricing.
- **Authorization Check:** Backend MUST verify:
  `product.seller._id.toString() === req.user.storeId.toString()`

---

### 5. `DELETE /api/products/:id` (Vendor Product Archive)
Removes or soft-deletes a product from the public catalog.
- **Authorization Check:** Backend MUST verify:
  `product.seller._id.toString() === req.user.storeId.toString()`

---

### 6. `GET /api/vendor/inventory`
Retrieves stock levels and turnaround times for inventory monitoring.
- **Response Shape (`data`):**
```json
[
  {
    "_id": "66f44d5c9e2b1a3d4f8e9a01",
    "title": "Hand-Spun Raw Mulberry Silk Throw",
    "category": "Textiles & Weaves",
    "price": 18500,
    "stock": 14,
    "status": "In Stock",
    "craftTime": "48 artisan hours",
    "sku": "VYR-KVR-A01",
    "image": "https://images.unsplash.com/photo-..."
  }
]
```

---

### 7. `GET /api/vendor/orders`
Retrieves client commissions that contain items belonging to this vendor's atelier.
- **Crucial Multi-Vendor Isolation Rule:**
  In a multi-vendor checkout where a patron purchases from Atelier A and Atelier B, the backend query must project **only Atelier A's items and Atelier A's package subtotal** when queried by Atelier A's vendor token.

```json
[
  {
    "_id": "66f44d5c9e2b1a3d4f8e9e01",
    "orderNumber": "VYR-884219",
    "createdAt": "2026-09-20T10:15:00Z",
    "status": "confirmed",
    "customer": {
      "name": "Aria Thorne",
      "email": "customer@veyra.com",
      "phone": "+91 98201 44520"
    },
    "shippingAddress": {
      "name": "Aria Thorne",
      "addressLine1": "42 Altamount Road, Horizon Residence 14B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400026",
      "country": "India"
    },
    "items": [
      {
        "productId": "66f44d5c9e2b1a3d4f8e9a01",
        "title": "Hand-Spun Raw Mulberry Silk Throw",
        "price": 18500,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-..."
      }
    ],
    "totalAmount": 18500,
    "carrier": "Blue Dart Apex Heritage",
    "trackingNumber": "BD992841920IN"
  }
]
```

---

### 8. `PATCH /api/vendor/orders/:id`
Updates fulfillment status, courier provider, and tracking numbers for the vendor's package.
- **Request Payload:**
```json
{
  "status": "dispatched",
  "carrier": "Blue Dart Apex Heritage",
  "trackingNumber": "BD992841920IN"
}
```
- **Allowed Statuses:** `confirmed`, `processing`, `dispatched`, `delivered`, `cancelled`.

---

### 9. `GET /api/vendor/store` & `PUT /api/vendor/store`
Retrieves or updates the atelier's public brand profile.
- **Payload Shape:**
```json
{
  "name": "Kaveri Living",
  "guild": "Textiles & Weaves",
  "tagline": "Slow-spun mulberry silk and handloom heirloom textiles from the ghats of Varanasi.",
  "location": "Varanasi, Uttar Pradesh",
  "masterArtisan": "Devendra & Shanti Sharma",
  "artisanTitle": "Master Weavers of the Royal Benares Guild",
  "artisanStory": "Every piece passes through thirty-six precise hand gestures...",
  "avatarImage": "https://images.unsplash.com/photo-...",
  "bannerImage": "https://images.unsplash.com/photo-...",
  "contactEmail": "concierge@kaveriliving.com",
  "contactPhone": "+91 542 228 9011",
  "establishedYear": 1894
}
```

---

### 10. `GET /api/vendor/analytics`
Returns aggregate revenue, volume velocity, and category sales shares.
- **Response Shape (`data`):**
```json
{
  "revenueData": [
    { "month": "Apr", "revenue": 42000, "orders": 8 },
    { "month": "May", "revenue": 58000, "orders": 12 },
    { "month": "Jun", "revenue": 84000, "orders": 19 },
    { "month": "Jul", "revenue": 112000, "orders": 24 },
    { "month": "Aug", "revenue": 145000, "orders": 31 },
    { "month": "Sep", "revenue": 184500, "orders": 38 }
  ],
  "categoryBreakdown": [
    { "name": "Textiles & Weaves", "percentage": 54, "sales": 99630 },
    { "name": "Ceramics & Stoneware", "percentage": 22, "sales": 40590 },
    { "name": "Living & Decor", "percentage": 14, "sales": 25830 },
    { "name": "Ritual & Fragrance", "percentage": 10, "sales": 18450 }
  ],
  "topProducts": [
    {
      "id": "66f44d5c9e2b1a3d4f8e9a01",
      "title": "Hand-Spun Raw Mulberry Silk Throw",
      "unitsSold": 28,
      "revenue": 518000,
      "conversion": "6.2%"
    }
  ],
  "patronRetentionRate": 41.8,
  "averageOrderValue": 18420,
  "dispatchesOnTime": "98.4%"
}
```

---

## 3. Super Admin Control Plane API Endpoint Contracts (Phase 4D)

All `/api/admin/*` routes strictly mandate root administrator authentication:
`Authorization: Bearer <JWT_TOKEN>` with decoded payload `req.user.role === "admin"`.
Requests failing role authorization must return HTTP 401 Unauthorized or HTTP 403 Forbidden.

> **Simulation Notice:** All financial indicators (e.g. ₹24.8L GMV, ₹3.42L escrow holds, 12.5% take-rate) are simulated sandbox figures. The backend must enforce statutory accounting and escrow holds without direct banking credentials.

### 1. `GET /api/admin/metrics`
Delivers macro-level governance metrics, velocity sparklines, urgent action queues, and guild distributions.
- **Response Shape (`data`):**
```json
{
  "kpis": {
    "totalGmv": { "value": "₹24.8L", "change": "+14.2% MoM", "trend": "up" },
    "activeStores": { "value": "512", "change": "+8 this week", "trend": "up" },
    "escrowHold": { "value": "₹3.42L", "subtitle": "Axis Nodal AP-1", "trend": "neutral" },
    "flaggedProducts": { "value": "14", "subtitle": "Critical Action Req.", "trend": "alert" },
    "pendingKyc": { "value": "8", "subtitle": "SLA < 12h remaining", "trend": "warning" },
    "platformTakeRate": { "value": "12.5%", "subtitle": "Avg. Blended Rate", "trend": "neutral" }
  },
  "actionQueues": {
    "urgentKyc": [
      {
        "id": "APP-9821",
        "tradeName": "Kashmir Loom Masters",
        "craftCluster": "Srinagar Pashmina Guild",
        "districtState": "Srinagar, Jammu & Kashmir",
        "giTagNumber": "GI-IN-0042",
        "submittedHoursAgo": 3,
        "urgency": "critical"
      }
    ],
    "integrityAlerts": [
      {
        "id": "PRD-MOD-019",
        "sku": "VY-SKU-0912",
        "title": "Kullu Pattern Pashmina Shawl (Powerloom Suspect)",
        "sellerName": "Urban Weaves Studio",
        "flagReason": "Burn test spectral scan indicates 22% synthetic polyester blend",
        "reportedBy": "Certified Handloom Examiner #44",
        "severity": "high"
      }
    ]
  },
  "craftGuildClusters": [
    { "name": "Varanasi Silk Weavers Guild", "state": "Uttar Pradesh", "merchants": 128, "activeGmv": "₹8.42L", "giStatus": "Certified" },
    { "name": "Kashmir Pashmina Artisans", "state": "Jammu & Kashmir", "merchants": 94, "activeGmv": "₹6.18L", "giStatus": "Certified" }
  ]
}
```

---

### 2. `GET /api/admin/applications` & `PATCH /api/admin/applications/:id`
Manages artisan guild KYC applications, statutory GSTIN validation, and storefront activation.
- **`GET /api/admin/applications` Response Shape (`data`):**
```json
[
  {
    "id": "APP-9821",
    "tradeName": "Kashmir Loom Masters",
    "legalEntity": "Kashmir Loom Masters Handloom Cooperative Society Ltd.",
    "panGst": "01AABCK1234F1Z8",
    "giTagNumber": "GI-IN-0042",
    "craftSpecialty": "Pure Pashmina & Sozni Needlework",
    "craftCluster": "Srinagar Pashmina Guild",
    "districtState": "Srinagar, Jammu & Kashmir",
    "masterArtisans": 42,
    "annualTurnover": "₹18,50,000",
    "status": "pending",
    "statusBadge": "Pending Verification",
    "bankVerified": true
  }
]
```
- **`PATCH /api/admin/applications/:id` Request Payload:**
```json
{
  "status": "approved", // "approved" | "rejected" | "under_review"
  "justification": "Verified with Central Silk Board Registry. Physical loom inspection video authenticated."
}
```
- **Cross-Role Side Effects on Approval:**
  1. Creates or updates the store in `stores` collection with `status: "active"` and `verified: true`.
  2. Upgrades applicant user record to `role: "vendor"`, linking `storeId`.
  3. Activates the vendor dashboard (`/vendor`) and public artisan storefront (`/stores/:id`).

---

### 3. `GET /api/admin/vendors` & `PATCH /api/admin/vendors/:id`
Admin supervision of registered artisan ateliers, verified guild memberships, and suspension controls.
- **`PATCH /api/admin/vendors/:id` Request Payload:**
```json
{
  "status": "suspended" // "active" | "suspended"
}
```

---

### 4. `GET /api/admin/products` & `PATCH /api/admin/products/:id/moderation`
Supervisory catalog moderation, forensic burn-test evidence review, and statutory provenance enforcement.
- **`PATCH /api/admin/products/:id/moderation` Request Payload:**
```json
{
  "status": "quarantined", // "approved" | "quarantined" | "rejected"
  "reason": "Spectral scan indicates 22% synthetic polyester blend violating GI tag requirements."
}
```
- **Cross-Role Side Effects:**
  1. Products marked `quarantined` or `rejected` are immediately purged from public search, homepage discovery, and `/products` catalog listings.
  2. Public product detail page (`/product/:id`) displays moderation status or returns 404.
  3. Restoring status to `approved` returns the SKU to active consumer visibility.

---

### 5. `GET /api/admin/orders` & `PATCH /api/admin/orders/:id/escrow`
Supervises parent consumer multi-vendor baskets, split artisan workshop consignments, and nodal escrow releases.
- **`GET /api/admin/orders` Response Shape (`data`):**
```json
{
  "metrics": {
    "grossVolume": "3,412 Orders",
    "grossGmv": "₹1.48 Cr GMV",
    "escrowPool": "₹24,80,450",
    "escrowBank": "Axis Nodal #0912",
    "multiVendorRate": "44.2%",
    "multiVendorCount": "1,508",
    "activeDisputes": 3,
    "disputeAmount": "₹12,480"
  },
  "orders": [
    {
      "id": "VY-90482",
      "orderDate": "Nov 14, 2024 • 10:15 AM",
      "customerName": "Priya Sharma",
      "customerLocation": "Bandra West, Mumbai",
      "totalAmount": "₹7,090.00",
      "platformFee": "₹567.20",
      "disbursableAmount": "₹6,402.80",
      "paymentRail": "upi",
      "dispatchStatus": "in_transit",
      "escrowStatus": "secured",
      "statusText": "UPI Verified • In Escrow",
      "isMultiVendor": true,
      "consignments": [
        {
          "storeName": "Origin Specialty Roasters",
          "storeLocation": "Coorg, KA",
          "itemSummary": "Hand-Hammered Brass Filter Coffee Maker (x2) & Peaberry Coffee",
          "itemImage": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
          "carrier": "Priority Air",
          "awb": "881920",
          "statusBadge": "In Transit • Departs BLR Air Hub",
          "amount": "₹3,780.00",
          "holdNote": "Held (Releases upon Delivery OTP)"
        },
        {
          "storeName": "Kaveri Living Studio",
          "storeLocation": "Jaipur, RJ",
          "itemSummary": "Indigo Kantha Quilted Bed Throw (x1)",
          "itemImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
          "carrier": "Bluedart Express",
          "awb": "748920",
          "statusBadge": "Packed & Sealed in Bagru Atelier",
          "amount": "₹3,440.00",
          "holdNote": "Held in Nodal Reserve"
        }
      ]
    }
  ]
}
```
- **`PATCH /api/admin/orders/:id/escrow` Request Payload:**
```json
{
  "escrowStatus": "released", // "released" | "held_dispute" | "refunded"
  "reason": "Two-key override: Recipient delivery confirmation verified via telephone handshake."
}
```

---

### 6. `GET /api/admin/settings` & `PUT /api/admin/settings`
Global marketplace identity, statutory grievance contacts, craft commission sliders, escrow hold parameters, and CIDR allowlists.
- **`PUT /api/admin/settings` Request Payload:**
```json
{
  "legalEntityName": "VEYRA Mercantile Technologies Ltd.",
  "cin": "U74999MH2022PTC384912",
  "helpline": "1800-VEYRA-MKR (1800-83972-657)",
  "grievanceOfficerName": "Vikramaditya Roy (Designated Director)",
  "grievanceOfficerEmail": "grievance@veyra.in",
  "maintenanceMode": false,
  "handloomCommission": 8.0,
  "metalCommission": 10.0,
  "gourmetCommission": 6.0,
  "escrowHoldHours": 48,
  "idleSessionTimeout": 15,
  "cidrAllowlist": "103.21.58.0/24",
  "mandatoryJustification": true
}
```

---

## 4. Cross-Role Data Consistency Matrix

| Action | Originating Screen | Target Role/Surface | Synchronized State Change |
|---|---|---|---|
| **Approve Vendor KYC** | `/admin/applications` | Vendor (`/vendor`) & Public Storefront (`/stores/:id`) | Sets store `status: "active"`, verifies GI credentials, grants artisan access to vendor workspace, and surfaces public atelier. |
| **Reject Vendor KYC** | `/admin/applications` | Onboarding / Auth | Sets application `status: "rejected"`, records statutory justification note, suppresses storefront generation. |
| **Quarantine Product SKU** | `/admin/products` | Public Catalog (`/products`, `/product/:id`) | Sets `moderationStatus: "quarantined"`, instantly hides SKU from consumer catalog and search results. |
| **Restore Product SKU** | `/admin/products` | Public Catalog (`/products`) | Sets `moderationStatus: "approved"`, restores SKU to active customer browsing. |
| **Merchant Dispatch Handover** | `/vendor/orders` | Admin Escrow Oversight (`/admin/orders`) | Updates child consignment logistics tracking (AWB, carrier), advances escrow hold countdown. |
| **Two-Key Escrow Force Release** | `/admin/orders` | Merchant Financials (`/vendor/analytics`) | Marks escrow pool line-item as released, triggering simulated bank ledger disbursement. |

---

## 5. Database Schema Recommendations (Mongoose)

### Product Model
```javascript
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  isGiCertified: { type: Boolean, default: false },
  moderationStatus: {
    type: String,
    enum: ["approved", "pending", "quarantined", "rejected"],
    default: "approved"
  },
  moderationReason: { type: String },
  seller: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true },
    storeName: { type: String, required: true },
    location: { type: String },
    isVerified: { type: Boolean, default: false }
  },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  attributes: {
    origin: { type: String },
    material: { type: String },
    craftTime: { type: String },
    dimensions: { type: String },
    care: { type: String }
  }
}, { timestamps: true });
```

---

## 6. Steps to Connect Real Backend

1. **Configure Environment:** In `.env.development` or `.env.production`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_USE_MOCK_API=false
   ```
2. **CORS Headers:** Enable CORS on Express app for origin `http://localhost:5173` with credentials allowed.
3. **Route Prefixes:** Ensure Express routes mount under `/api`:
   - `/api/auth`
   - `/api/products`
   - `/api/orders`
   - `/api/stores`
   - `/api/vendor`
   - `/api/admin`
4. **Authentication Middleware:** Ensure JWT middleware decodes `req.user` with `_id`, `role`, `storeId`, and `storeName`. All `/api/admin/*` routes must enforce `req.user.role === 'admin'`.
