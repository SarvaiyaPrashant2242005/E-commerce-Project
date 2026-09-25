// Products API Service
import api, { unwrap } from "./client";

export const productsApi = {
  getProducts: async (params = {}) => {
    const res = await api.get("/products", { params });
    const data = unwrap(res);
    return {
      products: data?.products || (Array.isArray(data) ? data : []),
      totalProducts: data?.totalProducts || (Array.isArray(data) ? data.length : 0),
      totalPages: data?.totalPages || 1,
      currentPage: data?.currentPage || 1,
    };
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return unwrap(res);
  },

  createProduct: async (productData) => {
    const res = await api.post("/products", productData);
    return unwrap(res);
  },

  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return unwrap(res);
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return unwrap(res);
  },
};
