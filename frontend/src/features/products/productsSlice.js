import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../utils/axiosAuth";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  isDeleted: false,
  isCreated: false,
  isEdited: false,
};

// get all products
export const listProducts = createAsyncThunk(
  "products/listProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/v1/products");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get single product
export const getSingleProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// create product - ADMIN ONLY
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productInfo, thunkAPI) => {
    try {
      const {
        data: { product },
      } = await axiosAuth.post(`/products`, productInfo);
      return product;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// edit product - ADMIN ONLY
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ([id, productInfo], thunkAPI) => {
    try {
      const {
        data: { updatedProduct },
      } = await axiosAuth.put(
        `/products/${[id, productInfo][0]}`,
        [id, productInfo][1]
      );
      return updatedProduct;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// delete product - ADMIN ONLY
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await axiosAuth.delete(`/products/${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        const { products } = action.payload;
        state.loading = false;
        state.products = products;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        const { product } = action.payload;
        state.loading = false;
        state.product = product;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isCreated = true;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isEdited = true;
        state.product = action.payload;
      })
      .addCase(editProduct.rejected, (state, action) => {
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

export default productsSlice.reducer;
