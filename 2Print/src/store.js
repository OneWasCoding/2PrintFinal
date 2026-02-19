import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. Create a simple Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

// 2. Configure the Store
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});