import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import productsReducer from "./features/products/productsSlice";
import usersReducer from "./features/users/usersSlice";
import ordersReducer from "./features/orders/ordersSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
  },
});

export default store;
