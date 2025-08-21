import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import Swal from "sweetalert2";
import { axiosWithToken } from "../../../utils/axiosUtils";
import { showSuccessAlert, showErrorAlert } from "../../../utils/alertUtils";

const url = "/customers";

const initialState = {
  customers: [],
  error: null,
  isLoading: false,
  isPostLoading: false,
  isUpdateLoading: false,
  customersWithOldPendingItems: [], 
  isOldPendingLoading: false,       
  oldPendingError: null,  
};

export const customersGetData = createAsyncThunk(
  "customers/getData",
  async (data, { rejectWithValue }) => {
    try {
      const myheader = axiosWithToken(data);

      const response = await axios.get(url, {
        headers: myheader?.headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching data."
      );
    }
  }
);
export const customersWithOldPendingItemsGet = createAsyncThunk(
  "customers/getWithOldPendingItems",
  async ({ days, data }, { rejectWithValue }) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.get(
        `/customers?has_pending_items_older_than=${days}`,
        { headers: myheader?.headers }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching customers with old pending items."
      );
    }
  }
);
export const postCustomersData = createAsyncThunk(
  "customers/postData",
  async (
    { data, customers, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.post(url, customers, {
        headers: myheader?.headers,
      });
      dispatch(customersGetData(data));
      showSuccessAlert("Successfully Created!");
      toggle?.();
      setSubmitting?.(false);
      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while posting data."
      );
    }
  }
);

export const updateCustomersData = createAsyncThunk(
  "customers/updateData",
  async (
    { data, customers, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.put(`${url}/${data.id}`, customers, {
        headers: myheader?.headers,
      });

      dispatch(customersGetData(data));
      showSuccessAlert("Successfully Updated!");

      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while updating data."
      );
    }
  }
);
export const updateCustomerPendingItems = createAsyncThunk(
  "customers/updatePendingItems",
  async (
    { data, pendingItems, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.put(
        `/customers/${data.id}/pending-items`,
        pendingItems,
        { headers: myheader?.headers }
      );

      dispatch(customersGetData(data));
      showSuccessAlert("Pending items updated!");

      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while updating pending items."
      );
    }
  }
);
export const deleteCustomersData = createAsyncThunk(
  "customers/deleteData",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const myheader = axiosWithToken(data);
      await axios.delete(`${url}/${id}`, { headers: myheader?.headers });

      Swal.fire("Deleted!", "Your Record has been deleted.", "success").then(
        () => {
          dispatch(customersGetData(data));
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while deleting data."
      );
    }
  }
);

// Slice setup
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(customersGetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(customersGetData.fulfilled, (state, action) => {
        state.customers = action.payload;
        state.isLoading = false;
      })
      .addCase(customersGetData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // pending customers with old pending items
      .addCase(customersWithOldPendingItemsGet.pending, (state) => {
        state.isOldPendingLoading = true;
        state.oldPendingError = null;
      })
      .addCase(customersWithOldPendingItemsGet.fulfilled, (state, action) => {
        state.isOldPendingLoading = false;
        state.customersWithOldPendingItems = action.payload;
      })
      .addCase(customersWithOldPendingItemsGet.rejected, (state, action) => {
        state.isOldPendingLoading = false;
        state.oldPendingError = action.payload;
      })
      // post
      .addCase(postCustomersData.pending, (state) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(postCustomersData.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.customers = action.payload;
      })
      .addCase(postCustomersData.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomersData.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateCustomersData.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.customers = action.payload;
      })
      .addCase(updateCustomersData.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomerPendingItems.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateCustomerPendingItems.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.customers = action.payload;
      })
      .addCase(updateCustomerPendingItems.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCustomersData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default customersSlice.reducer;
