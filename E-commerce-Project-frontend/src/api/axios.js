import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-project-3xfp.onrender.com/api",
});

// Har request me JWT token automatically attach hota hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;