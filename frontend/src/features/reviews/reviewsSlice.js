import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const initialState = {
  reviews: null,
  isEdited: false,
  loading: false,
  isAdded: false,
  error: "",
};

// get product reviews
export const getProductReviews = createAsyncThunk(
  "reviews/get",
  async (id, thunkAPI) => {
    try {
      const {
        data: { reviews },
      } = await axiosAuth.get(`/api/v1/products/${id}/reviews`);

      return reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// create review
export const addReview = createAsyncThunk(
  "reviews/add",
  async ([id, reviewInfo], thunkAPI) => {
    try {
      const {
        data: { reviews },
      } = await axiosAuth.post(
        `/api/v1/products/${[id, reviewInfo][0]}/reviews`,
        [id, reviewInfo][1]
      );
      return reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const adminSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = "";
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdded = true;
        state.error = "";
        toast.success("Dodali ste recenziju");
      })
      .addCase(addReview.rejected, (state, action) => {
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

export default adminSlice.reducer;
