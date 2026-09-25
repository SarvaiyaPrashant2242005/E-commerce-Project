// MSW Handlers for Stores & Ateliers
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
});

export const storeHandlers = [
  // List all stores / guilds
  http.get("*/api/stores", async () => {
    await delay(120);
    const stores = mockDb.getStores();
    return HttpResponse.json(formatSuccess(stores, "Stores retrieved successfully"));
  }),

  // Get store details with curated products
  http.get("*/api/stores/:id", async ({ params }) => {
    await delay(100);
    const { id } = params;
    const store = mockDb.getStoreById(id);

    if (!store) {
      return HttpResponse.json(
        { success: false, errorCode: "STORE_NOT_FOUND", errorMessage: "Store not found" },
        { status: 404 }
      );
    }

    const products = mockDb.getProducts({ storeId: store._id, limit: 20 }).products;
    return HttpResponse.json(formatSuccess({ ...store, products }, "Store details retrieved"));
  }),

  // Update store settings (Vendor)
  http.put("*/api/stores/:id", async ({ params, request }) => {
    await delay(200);
    const { id } = params;
    const updates = await request.json();
    const updated = mockDb.updateStore(id, updates);
    return HttpResponse.json(formatSuccess(updated, "Atelier settings updated"));
  }),

  // Artisan onboarding application
  http.post("*/api/stores/onboard", async ({ request }) => {
    await delay(250);
    const body = await request.json();
    const app = {
      _id: "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10),
      ...body,
      status: "pending",
      appliedAt: new Date().toISOString()
    };
    mockDb.vendorApps.unshift(app);
    return HttpResponse.json(formatSuccess(app, "Artisan guild application submitted for review"), { status: 201 });
  })
];
