import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = {
  productsInCart: ProductInCart[];
  subtotal: number;
  appliedCoupon: {
    code: string;
    type: "Percentage" | "Fixed Amount";
    value: number;
    discountAmount: number;
  } | null;
};

const initialState: CartState = {
  productsInCart: [],
  subtotal: 0,
  appliedCoupon: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const product = state.productsInCart.find(
        (product) => product.id === action.payload.id
      );
      if (product) {
        state.productsInCart = state.productsInCart.map((product) => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              quantity: product.quantity + action.payload.quantity,
            };
          }
          return product;
        });
      } else {
        state.productsInCart.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    removeProductFromTheCart: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      state.productsInCart = state.productsInCart.filter(
        (product) => product.id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      state.productsInCart = state.productsInCart.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            quantity: action.payload.quantity,
          };
        }
        return product;
      });
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; type: "Percentage" | "Fixed Amount"; value: number }>
    ) => {
      state.appliedCoupon = {
        code: action.payload.code,
        type: action.payload.type,
        value: action.payload.value,
        discountAmount: 0,
      };
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
      if (state.appliedCoupon) {
        if (state.appliedCoupon.type === "Percentage") {
          state.appliedCoupon.discountAmount = Math.min(
            state.subtotal,
            Math.round((state.subtotal * state.appliedCoupon.value) / 100)
          );
        } else {
          state.appliedCoupon.discountAmount = Math.min(
            state.subtotal,
            state.appliedCoupon.value
          );
        }
      }
    },
  },
});

export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  applyCoupon,
  removeCoupon,
  calculateTotalPrice,
} = cartSlice.actions;

export default cartSlice.reducer;
