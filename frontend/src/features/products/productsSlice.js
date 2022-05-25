import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const initialState = {
  products: [],
  product: null,
  pages: 0,
  page: 1,
  pagination: {},
  loading: false,
  error: null,
  isDeleted: false,
  isCreated: false,
  isEdited: false,
  searchKeyword: "",
};

// get all products
export const listProducts = createAsyncThunk(
  "products/listProducts",
  async ([currPage, searchKyw], thunkAPI) => {
    let page = [currPage, searchKyw][0];
    let search = [currPage, searchKyw][1];
    try {
      let url = `/api/v1/products?page=${page}`;
      if (search !== "") {
        url = url + `&search=${search}`;
      }
      const { data } = await axios.get(url);
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
  reducers: {
    resetIsStates: (state) => {
      return {
        ...state,
        isCreated: false,
        isDeleted: false,
        isEdited: false,
      };
    },
    resetQuery: (state) => {
      return {
        ...state,
        searchKeyword: "",
        page: 1,
      };
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setPageNumber: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        const { data, pages, pagination, page } = action.payload;
        state.loading = false;
        state.products = data;
        state.pagination = pagination;
        state.pages = pages;
        state.page = page;
        state.error = "";
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
        state.error = "";
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
        state.error = "";
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
        state.error = "";
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
        state.error = "";

        toast.success("Ažuriranje uspješno!");
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

export const { resetIsStates, setSearchKeyword, resetQuery, setPageNumber } =
  productsSlice.actions;

export default productsSlice.reducer;
