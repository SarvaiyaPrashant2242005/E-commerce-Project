// Super Admin Control Plane API Service
import api, { unwrap } from "./client";

export const adminApi = {
  // Screen 1: Marketplace Overview
  getMetrics: async () => {
    const res = await api.get("/admin/metrics");
    return unwrap(res);
  },

  // Screen 2: Vendor Applications & KYC
  getApplications: async () => {
    const res = await api.get("/admin/applications");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.applications || [];
  },

  updateApplicationStatus: async (id, status, justification = "") => {
    const res = await api.patch(`/admin/applications/${id}`, { status, justification });
    return unwrap(res);
  },

  // Screen 3: Vendors & Guilds Management
  getVendors: async () => {
    const res = await api.get("/admin/vendors");
    const data = unwrap(res);
    return data;
  },

  updateVendorStatus: async (id, status) => {
    const res = await api.patch(`/admin/vendors/${id}`, { status });
    return unwrap(res);
  },

  // Screen 4: Products Moderation
  getProductsForModeration: async () => {
    const res = await api.get("/admin/products");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.products || [];
  },

  updateProductModeration: async (id, status, reason = "") => {
    const res = await api.patch(`/admin/products/${id}/moderation`, { status, reason });
    return unwrap(res);
  },

  // Screen 5: Orders & Escrow Oversight
  getOrdersAndEscrow: async () => {
    const res = await api.get("/admin/orders");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.orders || [];
  },

  updateEscrowStatus: async (orderId, escrowStatus, reason = "") => {
    const res = await api.patch(`/admin/orders/${orderId}/escrow`, { escrowStatus, reason });
    return unwrap(res);
  },

  // Screen 6: Platform Settings & Governance
  getSettings: async () => {
    const res = await api.get("/admin/settings");
    return unwrap(res);
  },

  updateSettings: async (settingsData) => {
    const res = await api.put("/admin/settings", settingsData);
    return unwrap(res);
  },

  // Supplemental: Customers & Patrons List
  getCustomers: async () => {
    const res = await api.get("/admin/customers");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.customers || [];
  },
};

export default adminApi;