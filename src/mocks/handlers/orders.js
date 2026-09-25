// MSW Handlers for Orders, Fulfillment & Checkout
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
});

export const orderHandlers = [
  // List orders
  http.get("*/api/orders", async ({ request }) => {
    await delay(120);
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const storeId = url.searchParams.get("storeId");

    let orders = mockDb.getOrders(customerId);
    if (storeId) {
      orders = orders.filter((o) => o.items.some((i) => i.storeId === storeId));
    }

    return HttpResponse.json(formatSuccess(orders, "Orders retrieved successfully"));
  }),

  // Get single order with tracking stages
  http.get("*/api/orders/:id", async ({ params }) => {
    await delay(100);
    const { id } = params;
    const order = mockDb.getOrderById(id);

    if (!order) {
      return HttpResponse.json(
        { success: false, errorCode: "ORDER_NOT_FOUND", errorMessage: "Order not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(formatSuccess(order, "Order details retrieved"));
  }),

  // Create order (Customer checkout)
  http.post("*/api/orders", async ({ request }) => {
    await delay(250);
    const orderData = await request.json();
    const created = mockDb.createOrder(orderData);
    return HttpResponse.json(formatSuccess(created, "Commission confirmed and artisan notified"), { status: 201 });
  }),

  // Legacy payments endpoint compatibility
  http.post("*/api/payments/create-checkout-session", async ({ request }) => {
    await delay(200);
    const body = await request.json();
    return HttpResponse.json(
      formatSuccess(
        {
          url: "/order-success",
          sessionId: "mock-session-" + Date.now(),
          amount: body.amount || 20720
        },
        "Checkout session simulated"
      )
    );
  }),

  // Update order status (Vendor fulfillment action)
  http.patch("*/api/orders/:id/status", async ({ params, request }) => {
    await delay(150);
    const { id } = params;
    const { status } = await request.json();
    const updated = mockDb.updateOrderStatus(id, status);

    if (!updated) {
      return HttpResponse.json({ success: false, errorMessage: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(formatSuccess(updated, `Order status updated to ${status}`));
  })
];
