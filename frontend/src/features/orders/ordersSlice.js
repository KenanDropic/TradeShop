import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import axiosAuth from "../../utils/axiosAuth";

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
      const {
        data: { createdOrder },
      } = await axiosAuth.post("/orders", orderData);
      return createdOrder;
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
      const {
        data: { order },
      } = await axiosAuth.get(`/orders/${id}`);
      return order;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// update order TO PAID - ADMIN ONLY
export const updateOrderToPaid = createAsyncThunk(
  "orders/paid",
  async (id, thunkAPI) => {
    try {
      if (thunkAPI.getState().users.user.isAdmin === true) {
        const {
          data: { updatedOrder },
        } = await axiosAuth.put(`/orders/${id}`);
        console.log(updatedOrder);
        return updatedOrder;
      }

      // return order;
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
  reducers: {
    resetOrder: (state, action) => {},
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
      });
  },
});

export default ordersSlice.reducer;
