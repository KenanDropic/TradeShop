import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosAuth from "../../utils/axiosAuth";

const initialState = {
  users: null,
  products: null,
  orders: null,
  loading: false,
  error: "",
};

// get all users
export const getAllUsers = createAsyncThunk(
  "users/all",
  async (_, thunkAPI) => {
    try {
      const {
        data: { users },
      } = await axiosAuth.get("/users");

      return users;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
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

export const { resetAdminState } = adminSlice.actions;

export default adminSlice.reducer;
