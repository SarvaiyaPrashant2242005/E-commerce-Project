// Authentication & Patron Profile API Service
import api, { unwrap } from "./client";

export const authApi = {
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return unwrap(res);
  },

  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    return unwrap(res);
  },

  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return unwrap(res);
  },

  updateProfile: async (updates) => {
    const res = await api.put("/auth/profile", updates);
    return unwrap(res);
  },

  getAddresses: async () => {
    const res = await api.get("/auth/addresses");
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.addresses || [];
  },

  addAddress: async (addressData) => {
    const res = await api.post("/auth/addresses", addressData);
    return unwrap(res);
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return unwrap(res);
  },
};
