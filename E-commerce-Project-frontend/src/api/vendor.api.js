// Vendor Workspace API Service
// Centralized service for artisan dashboard, inventory, orders, analytics & storefront
import api, { unwrap } from "./client";

export const vendorApi = {
  // Operational metrics overview
  getMetrics: async () => {
    const res = await api.get("/vendor/metrics");
    return unwrap(res);
  },

  // Atelier inventory and stock monitoring
  getInventory: async () => {
    const res = await api.get("/vendor/inventory");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.inventory || [];
  },

  // Revenue, volume & category analytics
  getAnalytics: async () => {
    const res = await api.get("/vendor/analytics");
    return unwrap(res);
  },

  // Vendor-specific order dispatches & fulfillment
  getOrders: async (params = {}) => {
    const res = await api.get("/vendor/orders", { params });
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.orders || [];
  },

  // Update dispatch fulfillment status, courier partner & tracking
  updateOrderStatus: async (orderId, updatePayload) => {
    const res = await api.patch(`/vendor/orders/${orderId}`, updatePayload);
    return unwrap(res);
  },

  // Fetch current vendor's atelier storefront profile
  getStoreProfile: async () => {
    const res = await api.get("/vendor/store");
    return unwrap(res);
  },

  // Update atelier storefront profile (name, bio, banner, logo, contacts)
  updateStoreProfile: async (storeData) => {
    const res = await api.put("/vendor/store", storeData);
    return unwrap(res);
  },
};

export default vendorApi;
