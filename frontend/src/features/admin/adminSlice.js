import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const initialState = {
  users: null,
  products: null,
  orders: null,
  userToEdit: {},
  loading: false,
  error: "",
  isDeleted: false,
  isEdited: false,
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

// delete user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      await axiosAuth.delete(`/users/${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get user by id
export const getSingleUser = createAsyncThunk(
  "users/singleUser",
  async (id, thunkAPI) => {
    try {
      const {
        data: { user },
      } = await axiosAuth.get(`/users/${id}`);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// update user
export const updateUser = createAsyncThunk(
  "users/update",
  async ([id, reqData], thunkAPI) => {
    try {
      const {
        data: { updatedUser },
      } = await axiosAuth.put(`/users/${[id, reqData][0]}`, [id, reqData][1]);

      return updatedUser;
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
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
        toast.success("Korisnik obrisan");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.isDeleted = false;
        state.error = action.payload;
      })
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userToEdit = action.payload;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isEdited = true;
        toast.success("Ažurirali ste korisnika");
      })
      .addCase(updateUser.rejected, (state, action) => {
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
