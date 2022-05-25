import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import productsReducer from "./features/products/productsSlice";
import usersReducer from "./features/users/usersSlice";
import ordersReducer from "./features/orders/ordersSlice";
import adminReducer from "./features/admin/adminSlice";
import reviewsReducer from "./features/reviews/reviewsSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
    admin: adminReducer,
    reviews: reviewsReducer,
  },
});

export default store;
