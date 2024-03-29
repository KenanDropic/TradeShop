import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import axiosAuth from "../../utils/axiosAuth";

const tokenFromStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

const initialState = {
  user: null,
  isLogged: false,
  token: tokenFromStorage,
  loading: false,
  error: "",
};

// login user
export const login = createAsyncThunk(
  "users/login",
  async (credentials, thunkAPI) => {
    try {
      const {
        data: { token },
      } = await axios.post("/api/v1/auth/login", credentials);
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// register user
export const registerUser = createAsyncThunk(
  "users/register",
  async (credentials, thunkAPI) => {
    try {
      const {
        data: { token },
      } = await axios.post("/api/v1/auth/register", credentials);
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get current user
export const getCurrentUser = createAsyncThunk(
  "users/loggedUser",
  async (_, thunkAPI) => {
    try {
      const {
        data: { user },
      } = await axiosAuth.get("/api/v1/auth/profile");
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// update user
export const updateUserDetails = createAsyncThunk(
  "users/updateUserDetails",
  async (updateInfo, thunkAPI) => {
    try {
      const {
        data: { updatedUser },
      } = await axiosAuth.put("/api/v1/auth/profile", updateInfo);
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

export const confirmEmail = createAsyncThunk(
  "users/confirmEmail",
  async (emailToken, thunkAPI) => {
    try {
      await axios.get(`/api/v1/auth/confirmEmail?token=${emailToken}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("token");
      return initialState;
    },
    resetUser: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.isLogged = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogged = true;
        state.error = "";
        state.token = action.payload;
        toast.success("Korisnik prijavljen uspješno");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isLogged = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLogged = true;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogged = true;
        state.error = "";
        state.token = action.payload;
        toast.success("Registracija korisnika uspješna");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isLogged = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLogged = true;
        state.loading = false;
        state.error = "";
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLogged = false;
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
        toast.success("Ažuriranje profila uspješno");
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(confirmEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
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

export const { logout, resetUser } = usersSlice.actions;

export default usersSlice.reducer;
