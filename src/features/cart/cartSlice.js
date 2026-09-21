import { createSlice } from "@reduxjs/toolkit";

const save = (items) => localStorage.setItem("cartItems", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: (() => { try { return JSON.parse(localStorage.getItem("cartItems")) || []; } catch { return []; } })(),
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
      save(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      save(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
      save(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;