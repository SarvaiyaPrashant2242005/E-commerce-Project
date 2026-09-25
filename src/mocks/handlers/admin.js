// MSW Handlers for Super Admin Control Plane
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
});

/**
 * Simulates real backend authorization for all /api/admin/* routes
 * The real backend must independently enforce these permissions.
 */
const verifyAdminAuth = (request) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return {
      authorized: false,
      response: HttpResponse.json(
        {
          success: false,
          code: 401,
          message: "Unauthorized: Missing administrative bearer token"
        },
        { status: 401 }
      )
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");
  const user = mockDb.users.find((u) => u.token === token);
  const isAdmin = (user && user.role === "admin") || token.includes("admin");

  if (!isAdmin) {
    return {
      authorized: false,
      response: HttpResponse.json(
        {
          success: false,
          code: 403,
          message: "Forbidden: Super Administrator credentials required"
        },
        { status: 403 }
      )
    };
  }

  return { authorized: true };
};

export const adminHandlers = [
  // 1. Super Admin Marketplace Overview Metrics
  http.get("*/api/admin/metrics", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(100);
    const pendingApps = mockDb.vendorApps.filter((a) => a.status === "pending").length;
    const flaggedProducts = mockDb.products.filter(
      (p) => p.moderationStatus === "quarantined" || p.moderationStatus === "pending_review"
    ).length;

    return HttpResponse.json(
      formatSuccess(
        {
          // Simulated Financial & Operational Telemetry
          marketplaceGMV: 2480000,
          grossMerchandiseValueStr: "₹24.8L",
          netPlatformRevenue: 310000,
          activeGuildsCount: mockDb.stores.length,
          verifiedArtisansCount: 48,
          curatedPiecesCount: mockDb.products.length,
          activePatronsCount: 1820,
          pendingApplicationsCount: pendingApps,
          flaggedProductsCount: flaggedProducts || 14,
          escrowHeldTotal: 342000,
          escrowHeldTotalStr: "₹3.42L",
          platformTakeRatePct: 12.5,
          isSimulatedDevData: true,
          simulationNotice: "Development Demonstration Model: ₹24.8L GMV, ₹3.42L escrow hold and 12.5% take-rate are simulated development metrics.",
          categoryYield: [
            { category: "Handlooms & Weaves", gmv: 682000, sharePct: 45.8 },
            { category: "Ceramics & Pottery", gmv: 345000, sharePct: 23.2 },
            { category: "Metal & Brassware", gmv: 241000, sharePct: 16.2 },
            { category: "Gourmet & Terroir", gmv: 221000, sharePct: 14.8 }
          ],
          topClusters: [
            { name: "Bagru & Sanganer Block-print Guild", gmv: 284000, percentage: 82 },
            { name: "Moradabad Brass Artisan Co-op", gmv: 221000, percentage: 65 },
            { name: "Kashmir Pashmina Master Weavers", gmv: 195000, percentage: 58 },
            { name: "Varanasi Silk Weaver Syndicate", gmv: 184000, percentage: 52 }
          ],
          monthlyVolumeData: [
            { month: "Jan", gmv: 180000 },
            { month: "Feb", gmv: 220000 },
            { month: "Mar", gmv: 310000 },
            { month: "Apr", gmv: 390000 },
            { month: "May", gmv: 480000 },
            { month: "Jun", gmv: 620000 }
          ]
        },
        "Marketplace telemetry synchronized"
      )
    );
  }),

  // 2. Vendor Applications / KYC Queue
  http.get("*/api/admin/applications", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(90);
    return HttpResponse.json(
      formatSuccess(
        mockDb.getVendorApplications(),
        "Vendor applications retrieved"
      )
    );
  }),

  // Adjudicate Vendor Application (Approve / Reject)
  http.patch("*/api/admin/applications/:id", async ({ params, request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(140);
    const { id } = params;
    const body = await request.json();
    const { status, justification } = body;
    const updated = mockDb.updateVendorApplication(id, status, justification);

    if (!updated) {
      return HttpResponse.json(
        { success: false, code: 404, message: "Application not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      formatSuccess(
        updated,
        `Vendor application successfully ${status === "approved" ? "approved and atelier activated" : "rejected"}`
      )
    );
  }),

  // 3. Vendors & Guilds Master Registry
  http.get("*/api/admin/vendors", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(100);
    const stores = mockDb.getStores();
    return HttpResponse.json(
      formatSuccess(
        {
          registeredStores: stores,
          totalGuilds: stores.length,
          activeCount: stores.filter((s) => s.status !== "suspended").length,
          suspendedCount: stores.filter((s) => s.status === "suspended").length,
          applications: mockDb.getVendorApplications()
        },
        "Vendors & guilds master directory loaded"
      )
    );
  }),

  // Update Vendor / Store Status (Suspend / Activate)
  http.patch("*/api/admin/vendors/:id", async ({ params, request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(120);
    const { id } = params;
    const { status } = await request.json();

    // Check if store or app
    let updated = mockDb.updateStoreStatus(id, status);
    if (!updated) {
      updated = mockDb.updateVendorApplication(id, status);
    }

    return HttpResponse.json(
      formatSuccess(updated, `Vendor status updated to ${status}`)
    );
  }),

  // 4. Products Moderation Queue
  http.get("*/api/admin/products", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(100);
    const items = mockDb.getProductsForModeration();
    return HttpResponse.json(
      formatSuccess(items, "Catalog items for moderation retrieved")
    );
  }),

  // Update Product Moderation Status (Approve / Quarantine / Reject)
  http.patch("*/api/admin/products/:id/moderation", async ({ params, request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(140);
    const { id } = params;
    const { status, reason } = await request.json();
    const updated = mockDb.updateProductModeration(id, status, reason);

    if (!updated) {
      return HttpResponse.json(
        { success: false, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      formatSuccess(
        updated,
        `Product SKU ${updated.sku || updated._id} moderation state set to ${status}`
      )
    );
  }),

  // 5. Orders & Escrow Oversight
  http.get("*/api/admin/orders", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(100);
    const orders = mockDb.getOrders();
    return HttpResponse.json(
      formatSuccess(orders, "Marketplace orders and escrow ledger loaded")
    );
  }),

  // Update Escrow Status (Force Release, Freeze, Refund)
  http.patch("*/api/admin/orders/:id/escrow", async ({ params, request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(150);
    const { id } = params;
    const { escrowStatus, reason } = await request.json();
    const updated = mockDb.updateOrderEscrowStatus(id, escrowStatus, reason);

    if (!updated) {
      return HttpResponse.json(
        { success: false, code: 404, message: "Order not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      formatSuccess(
        updated,
        `Order ${updated.orderNumber} escrow state overridden to ${escrowStatus}`
      )
    );
  }),

  // 6. Platform Settings & Governance
  http.get("*/api/admin/settings", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(80);
    return HttpResponse.json(
      formatSuccess(mockDb.getSettings(), "Platform configuration retrieved")
    );
  }),

  http.put("*/api/admin/settings", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(140);
    const updates = await request.json();
    const updated = mockDb.updateSettings(updates);
    return HttpResponse.json(
      formatSuccess(updated, "Platform settings successfully updated and persisted")
    );
  }),

  // Supplemental: Customers & Patrons List
  http.get("*/api/admin/customers", async ({ request }) => {
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

    await delay(90);
    const patrons = [
      {
        _id: "66f44d5c9e2b1a3d4f8e9c01",
        name: "Aria Thorne",
        email: "customer@veyra.com",
        tier: "Collector Patron",
        ordersCount: 6,
        totalSpend: 112400,
        joinedDate: "Mar 2026",
        city: "Mumbai"
      },
      {
        _id: "66f44d5c9e2b1a3d4f8e9c99",
        name: "Vikram Singhania",
        email: "vikram.s@singhania.in",
        tier: "Heritage Circle",
        ordersCount: 12,
        totalSpend: 348000,
        joinedDate: "Jan 2026",
        city: "New Delhi"
      }
    ];
    return HttpResponse.json(formatSuccess(patrons, "Patron roster loaded"));
  })
];