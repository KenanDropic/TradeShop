import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosAuth from "../../utils/axiosAuth";

const initialState = {
  order: [],
  userOrders: {
    orders: [],
    count: 0,
  },
  loading: false,
  error: "",
};

// add order to database
export const placeOrder = createAsyncThunk(
  "orders/getOrderDetais",
  async (orderData, thunkAPI) => {
    try {
      const {
        data: { createdOrder },
      } = await axiosAuth.post("/orders", orderData);
      return createdOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);
// get order details
export const getOrderDetails = createAsyncThunk(
  "orders/createOrder",
  async (id, thunkAPI) => {
    try {
      const {
        data: { order },
      } = await axiosAuth.get(`/orders/${id}`);
      return order;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// update order TO PAID
export const updateOrderToPaid = createAsyncThunk(
  "orders/paid",
  async ([id, paymentResult], thunkAPI) => {
    try {
      const {
        data: { updatedOrder },
      } = await axiosAuth.put(
        `/orders/${[id, paymentResult][0]}`,
        [id, paymentResult][1]
      );
      return updatedOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get user orders
export const getUserOrders = createAsyncThunk(
  "orders/userOrders",
  async (userId, thunkAPI) => {
    try {
      const {
        data: { orders, count },
      } = await axiosAuth.get(`/auth/${userId}/orders`);
      return { orders, count };
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrder: (state, action) => {
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        toast.success("Narudžba uspješna");
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderToPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderToPaid.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(updateOrderToPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// structure error message and return
const errorMessage = (error) => {
  const message =
    (error.response && error.response.data && error.response.data.error) ||
    error.message ||
    error.toString();

  return message;
};

export const { resetOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
