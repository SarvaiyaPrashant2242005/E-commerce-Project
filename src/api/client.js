// Normalized Axios API Client with Response Unwrapping
import api from "./axios";

/**
 * Normalizes backend responses whether they are wrapped in:
 * { success: true, data: { ... } } (standard VEYRA backend envelope)
 * or returned directly in Axios res.data.
 */
export const unwrap = (res) => {
  if (res && res.data && typeof res.data === "object" && "data" in res.data) {
    return res.data.data;
  }
  return res?.data;
};

export default api;
