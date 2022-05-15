import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  order: [],
  loading: false,
  error: "",
};

// add order to database
export const placeOrder = createAsyncThunk(
  "orders/getOrderDetais",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axios.post("/api/v1/orders", orderData, {
        headers: { Authorization: `Bearer ${thunkAPI.getState().users.token}` },
      });

      return data.createdOrder;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
// get order details
export const getOrderDetails = createAsyncThunk(
  "orders/createOrder",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${thunkAPI.getState().users.token}` },
      });

      return data.order;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// update order TO PAID - admin only
export const updateOrderToPaid = createAsyncThunk(
  "orders/paid",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.put(`/api/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${thunkAPI.getState().users.token}` },
      });

      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
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
      });
  },
});

export default ordersSlice.reducer;
