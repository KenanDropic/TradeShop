import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// dohvatamo element cartItems kojeg smo sačuvali u ls
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  isShippingS: false,
  isPaymentS: false,
  shippingAddress: shippingAddressFromStorage,
};

// add to cart
export const addToCart = createAsyncThunk(
  "cart/addCartItems",
  async ([id, qty], thunkAPI) => {
    try {
      const id2 = [id, qty][0];
      const { data } = await axios.get(`/api/v1/products/${id2}`);
      const itemCartCopy = {
        id: data.product._id,
        name: data.product.name,
        image: data.product.image,
        price: data.product.price,
        countInStock: data.product.countInStock,
        quantity: [id, qty][1],
      };
      //thunkAPI.fulfillWithValue vraća vrijednost u action.payload-u,a mi toj vrijednosti možemo pristupiti u reducerima,u ovom slučaju u extraReducers-u.
      return thunkAPI.fulfillWithValue(itemCartCopy);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      const id = action.payload;
      // filter out
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== id
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setIsShipping: (state) => {
      state.isShippingS = true;
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    setIsPayment: (state) => {
      state.isPaymentS = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;

        // biće 1 ako se item već nalazi u cart-u
        const itemIdx = state.cartItems.findIndex((x) => x.id === item.id);

        if (itemIdx >= 0) {
          // zamijenjujemo staru vrijednost quantity-a s novom vrijednošću
          state.cartItems[itemIdx].quantity = item.quantity;
        } else {
          state.cartItems = [...state.cartItems, item];
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  removeFromCart,
  setIsShipping,
  saveShippingAddress,
  setIsPayment,
} = cartSlice.actions;

export default cartSlice.reducer;
