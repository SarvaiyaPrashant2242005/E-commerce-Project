import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (creds, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", creds);
      const payload = res.data?.data || res.data;
      const user = payload.user || payload;
      const token = payload.token || res.data?.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.errorMessage || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      const payload = res.data?.data || res.data;
      const user = payload.user || payload;
      const token = payload.token || res.data?.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.errorMessage || "Registration failed");
    }
  }
);

const initialState = {
  user: (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })(),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;