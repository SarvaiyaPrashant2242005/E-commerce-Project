// Orders & Checkout API Service
import api, { unwrap } from "./client";

export const ordersApi = {
  getOrders: async (params = {}) => {
    const res = await api.get("/orders", { params });
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.orders || [];
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return unwrap(res);
  },

  createOrder: async (orderData) => {
    const res = await api.post("/orders", orderData);
    return unwrap(res);
  },

  updateOrderStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return unwrap(res);
  },
};
