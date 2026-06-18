import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WishlistState = {
  wishlistItems: Product[];
};

const storedWishlist = localStorage.getItem("zarka_wishlist");
const initialState: WishlistState = {
  wishlistItems: storedWishlist ? JSON.parse(storedWishlist) : [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.wishlistItems.find((item) => item.id === action.payload.id);
      if (exists) {
        state.wishlistItems = state.wishlistItems.filter((item) => item.id !== action.payload.id);
      } else {
        state.wishlistItems.push(action.payload);
      }
      localStorage.setItem("zarka_wishlist", JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("zarka_wishlist");
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
