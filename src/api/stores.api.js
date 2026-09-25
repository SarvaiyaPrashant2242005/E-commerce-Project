// Stores & Guilds API Service
import api, { unwrap } from "./client";

export const storesApi = {
  getStores: async () => {
    const res = await api.get("/stores");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.stores || [];
  },

  getStoreById: async (id) => {
    const res = await api.get(`/stores/${id}`);
    return unwrap(res);
  },

  updateStore: async (id, updates) => {
    const res = await api.put(`/stores/${id}`, updates);
    return unwrap(res);
  },

  submitOnboarding: async (formData) => {
    const res = await api.post("/stores/onboard", formData);
    return unwrap(res);
  },
};
