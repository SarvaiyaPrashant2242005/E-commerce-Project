// MSW Handlers for Artisan Merchant Workspace
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const KAVERI_STORE_ID = "66f44d5c9e2b1a3d4f8e9b01";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
});

const formatError = (code, message) => ({
  success: false,
  errorCode: "VENDOR_ERROR",
  errorMessage: message,
  messageToShow: message,
});

export const vendorHandlers = [
  // 1. Vendor Dashboard Overview Metrics
  http.get("*/api/vendor/metrics", async () => {
    await delay(120);
    const storeProducts = mockDb.products.filter(
      (p) => p.seller?._id === KAVERI_STORE_ID || p.storeId === KAVERI_STORE_ID
    );
    const allOrders = mockDb.orders;

    // Filter orders having items from Kaveri Living
    const vendorOrders = allOrders.filter((o) =>
      o.items?.some((i) => i.storeId === KAVERI_STORE_ID || i.storeName === "Kaveri Living")
    );

    const totalRevenue = vendorOrders.reduce((sum, o) => {
      const vendorItems = o.items.filter(
        (i) => i.storeId === KAVERI_STORE_ID || i.storeName === "Kaveri Living"
      );
      const itemsTotal = vendorItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
      return sum + itemsTotal;
    }, 0);

    const pendingOrdersCount = vendorOrders.filter(
      (o) => o.status === "confirmed" || o.status === "processing" || o.status === "pending"
    ).length;

    const lowStockCount = storeProducts.filter((p) => (p.stock || 0) < 10).length;

    return HttpResponse.json(
      formatSuccess(
        {
          grossMerchandiseVolume: totalRevenue || 142890,
          growthRate: 18.4,
          totalOrders: vendorOrders.length || 38,
          averageOrderValue: 3760,
          conversionRate: 4.82,
          activeCatalogCount: storeProducts.length,
          kilnLoomCount: 3,
          draftListingCount: 2,
          pendingFulfillmentCount: pendingOrdersCount || 5,
          urgentDispatchCount: 2,
          nextEscrowPayout: {
            amount: 48250,
            scheduledDate: "Tomorrow, 10:00 AM IST",
            holdPolicy: "48-hour patron craft inspection"
          },
          lowStockAlerts: lowStockCount,
          recentOrders: vendorOrders.slice(0, 5)
        },
        "Vendor metrics retrieved"
      )
    );
  }),

  // 2. Vendor Products Listing
  http.get("*/api/vendor/products", async () => {
    await delay(120);
    const storeProducts = mockDb.products.filter(
      (p) => p.seller?._id === KAVERI_STORE_ID || p.storeId === KAVERI_STORE_ID
    );
    return HttpResponse.json(formatSuccess(storeProducts, "Vendor products retrieved"));
  }),

  // 3. Vendor Inventory / Atelier Stock
  http.get("*/api/vendor/inventory", async () => {
    await delay(120);
    const storeProducts = mockDb.products.filter(
      (p) => p.seller?._id === KAVERI_STORE_ID || p.storeId === KAVERI_STORE_ID
    );

    const items = storeProducts.map((p) => ({
      _id: p._id,
      title: p.title || p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.2),
      stock: p.stock ?? 12,
      status: p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock",
      craftTime: p.attributes?.craftTime || "14 artisan hours",
      sku: "VYR-KVR-" + p._id.substring(18).toUpperCase(),
      image: p.images?.[0] || p.image,
      updatedAt: new Date().toISOString()
    }));
    return HttpResponse.json(formatSuccess(items, "Atelier inventory loaded"));
  }),

  // 4. Vendor Orders & Dispatches
  http.get("*/api/vendor/orders", async () => {
    await delay(150);
    const allOrders = mockDb.orders;

    // Filter and project only Kaveri Living items
    const vendorOrders = allOrders
      .filter((o) =>
        o.items?.some((i) => i.storeId === KAVERI_STORE_ID || i.storeName === "Kaveri Living")
      )
      .map((o) => {
        const vendorItems = o.items.filter(
          (i) => i.storeId === KAVERI_STORE_ID || i.storeName === "Kaveri Living"
        );
        const vendorSubtotal = vendorItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);

        return {
          _id: o._id,
          orderNumber: o.orderNumber,
          createdAt: o.createdAt,
          status: o.status || "confirmed",
          customer: o.customer || {
            name: o.shippingAddress?.name || "Patron",
            email: "patron@veyra.com",
            phone: o.shippingAddress?.phone || "+91 98201 44520"
          },
          shippingAddress: o.shippingAddress,
          items: vendorItems,
          totalAmount: vendorSubtotal,
          carrier: o.tracking?.carrier || "Blue Dart Apex Heritage",
          trackingNumber: o.tracking?.trackingNumber || "BD992841920IN",
          estimatedDelivery: o.tracking?.estimatedDelivery || "2026-09-28T18:00:00Z"
        };
      });

    return HttpResponse.json(formatSuccess(vendorOrders, "Vendor orders retrieved"));
  }),

  // 5. Update Order Fulfillment Status, Tracking & Carrier
  http.patch("*/api/vendor/orders/:id", async ({ params, request }) => {
    await delay(180);
    const { id } = params;
    const updates = await request.json();

    const order = mockDb.getOrderById(id);
    if (!order) {
      return HttpResponse.json(formatError(404, "Order commission not found"), { status: 404 });
    }

    if (updates.status) order.status = updates.status;
    if (updates.carrier || updates.trackingNumber) {
      order.tracking = {
        ...order.tracking,
        carrier: updates.carrier || order.tracking?.carrier || "Blue Dart Apex Heritage",
        trackingNumber: updates.trackingNumber || order.tracking?.trackingNumber || "BD-PENDING",
        dispatchedAt: updates.status === "dispatched" ? new Date().toISOString() : order.tracking?.dispatchedAt
      };
    }

    // Save update in mock store
    mockDb.updateOrderStatus(order._id, order.status);

    return HttpResponse.json(
      formatSuccess(
        {
          _id: order._id,
          status: order.status,
          tracking: order.tracking
        },
        "Order fulfillment status updated successfully"
      )
    );
  }),

  // 6. Vendor Storefront Settings Profile
  http.get("*/api/vendor/store", async () => {
    await delay(100);
    const store = mockDb.getStoreById(KAVERI_STORE_ID);
    if (!store) {
      return HttpResponse.json(formatError(404, "Atelier profile not found"), { status: 404 });
    }
    return HttpResponse.json(formatSuccess(store, "Store profile retrieved"));
  }),

  // 7. Update Vendor Storefront Profile
  http.put("*/api/vendor/store", async ({ request }) => {
    await delay(200);
    const updates = await request.json();
    const updated = mockDb.updateStore(KAVERI_STORE_ID, updates);
    if (!updated) {
      return HttpResponse.json(formatError(404, "Atelier profile not found"), { status: 404 });
    }
    return HttpResponse.json(formatSuccess(updated, "Atelier storefront settings saved"));
  }),

  // 8. Vendor Analytics
  http.get("*/api/vendor/analytics", async () => {
    await delay(150);
    return HttpResponse.json(
      formatSuccess(
        {
          revenueData: [
            { month: "Apr", revenue: 42000, orders: 8 },
            { month: "May", revenue: 58000, orders: 12 },
            { month: "Jun", revenue: 84000, orders: 19 },
            { month: "Jul", revenue: 112000, orders: 24 },
            { month: "Aug", revenue: 145000, orders: 31 },
            { month: "Sep", revenue: 184500, orders: 38 }
          ],
          categoryBreakdown: [
            { name: "Textiles & Weaves", percentage: 54, sales: 99630 },
            { name: "Ceramics & Stoneware", percentage: 22, sales: 40590 },
            { name: "Living & Decor", percentage: 14, sales: 25830 },
            { name: "Ritual & Fragrance", percentage: 10, sales: 18450 }
          ],
          topProducts: [
            {
              id: "66f44d5c9e2b1a3d4f8e9a01",
              title: "Hand-Spun Raw Mulberry Silk Throw",
              unitsSold: 28,
              revenue: 518000,
              conversion: "6.2%"
            },
            {
              id: "66f44d5c9e2b1a3d4f8e9a05",
              title: "Hand-Hammered Solid Brass Urli Bowl",
              unitsSold: 19,
              revenue: 121600,
              conversion: "4.8%"
            },
            {
              id: "66f44d5c9e2b1a3d4f8e9a08",
              title: "Hand-Woven Pashmina Cashmere Stole",
              unitsSold: 9,
              revenue: 238500,
              conversion: "3.9%"
            }
          ],
          patronRetentionRate: 41.8,
          averageOrderValue: 18420,
          dispatchesOnTime: "98.4%",
          simulatedDisclaimer: "All analytics and escrow disbursements are simulated development models."
        },
        "Analytics report compiled"
      )
    );
  })
];
