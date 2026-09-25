// MSW Handlers for Products
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
});

const formatError = (code, message, errorCode = "NOT_FOUND") => ({
  success: false,
  errorCode,
  errorMessage: message,
  messageToShow: message,
});

export const productHandlers = [
  // List products with pagination, search, category, and sorting
  http.get("*/api/products", async ({ request }) => {
    await delay(120);
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const storeId = url.searchParams.get("store") || url.searchParams.get("storeId") || "";
    const sort = url.searchParams.get("sort") || "featured";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);

    const result = mockDb.getProducts({ search, category, storeId, sort, page, limit });
    return HttpResponse.json(formatSuccess(result, "Products retrieved successfully"));
  }),

  // Get single product by ID
  http.get("*/api/products/:id", async ({ params }) => {
    await delay(100);
    const { id } = params;
    const product = mockDb.getProductById(id);

    if (!product) {
      return HttpResponse.json(
        formatError(404, `Product with ID '${id}' not found. Please browse available catalog items.`, "PRODUCT_NOT_FOUND"),
        { status: 404 }
      );
    }

    return HttpResponse.json(formatSuccess(product, "Product details retrieved successfully"));
  }),

  // Create new product (Vendor action)
  http.post("*/api/products", async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const created = mockDb.addProduct(body);
    return HttpResponse.json(formatSuccess(created, "Artisan piece cataloged successfully"), { status: 201 });
  }),

  // Update product (Vendor action)
  http.put("*/api/products/:id", async ({ params, request }) => {
    await delay(200);
    const { id } = params;
    const updates = await request.json();
    const updated = mockDb.updateProduct(id, updates);

    if (!updated) {
      return HttpResponse.json(formatError(404, "Product not found", "PRODUCT_NOT_FOUND"), { status: 404 });
    }

    return HttpResponse.json(formatSuccess(updated, "Product updated successfully"));
  }),

  // Delete product (Vendor action)
  http.delete("*/api/products/:id", async ({ params }) => {
    await delay(150);
    const { id } = params;
    const deleted = mockDb.deleteProduct(id);

    if (!deleted) {
      return HttpResponse.json(formatError(404, "Product not found", "PRODUCT_NOT_FOUND"), { status: 404 });
    }

    return HttpResponse.json(formatSuccess({ id }, "Product archived from catalog"));
  }),
];
