import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosAuth from "../../utils/axiosAuth";

const initialState = {
  allOrders: [],
  order: [],
  userOrders: {
    orders: [],
    count: 0,
  },
  loading: false,
  error: "",
  isPlaced: false,
  isDelivered: false,
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
  "orders/getOrderDetails",
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

// get all orders
export const listOrders = createAsyncThunk(
  "orders/all",
  async (_, thunkAPI) => {
    try {
      const {
        data: { orders },
      } = await axiosAuth.get("/orders");

      return orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// mark order as delivered
export const markOrderAsDelivered = createAsyncThunk(
  "orders/delivered",
  async (id, thunkAPI) => {
    try {
      const {
        data: { updatedOrder },
      } = await axiosAuth.put(`/orders/${id}/delivered`);
      return updatedOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrder: () => {
      return initialState;
    },
    resetIsPlaced: (state) => {
      return {
        ...state,
        isPlaced: false,
      };
    },
    resetIsDelivered: (state) => {
      return {
        ...state,
        isDelivered: false,
      };
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
        state.isPlaced = true;
        state.error = "";

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
        state.error = "";

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
        state.error = "";

      })
      .addCase(updateOrderToPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markOrderAsDelivered.pending, (state) => {
        state.loading = true;
      })
      .addCase(markOrderAsDelivered.fulfilled, (state, action) => {
        state.loading = false;
        state.isDelivered = true;
        state.order = action.payload;
        state.error = "";

      })
      .addCase(markOrderAsDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = "";

      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
        state.error = "";

      })
      .addCase(listOrders.rejected, (state, action) => {
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

export const { resetOrder, resetIsPlaced, resetIsDelivered } =
  ordersSlice.actions;

export default ordersSlice.reducer;
