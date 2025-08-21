import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import Swal from "sweetalert2";
import { axiosWithToken } from "../../../utils/axiosUtils";
import { showSuccessAlert } from "../../../utils/alertUtils";
import { customersGetData } from "./customersSlice";

const url = "/orders";

const initialState = {
  bills: [],
  billsByCustomer: [],
  error: null,
  isLoading: false,
  isPostLoading: false,
  isUpdateLoading: false,
};

export const billsGetData = createAsyncThunk(
  "bills/getData",
  async (data, { rejectWithValue }) => {
    console.log("data", data);
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.get(url, {
        headers: myheader?.headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching bill data."
      );
    }
  }
);
export const billsGetByCustomer = createAsyncThunk(
  "bills/getByCustomer",
  async ({ data }, { rejectWithValue }) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.get(`/customers/${data?.customerId}/orders`, {
        headers: myheader?.headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching customer orders."
      );
    }
  }
);
export const postBillsData = createAsyncThunk(
  "bills/postData",
  async (
    { data, bills, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data, false);
      const response = await axios.post(url, bills, {
        headers: myheader?.headers,
      });

      dispatch(billsGetData(data));
      dispatch(billsGetByCustomer({data}));
      dispatch(customersGetData(data));
      showSuccessAlert("Order Successfully Created!");
      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while posting bill data."
      );
    }
  }
);

export const updateBillsData = createAsyncThunk(
  "bills/updateData",
  async (
    { data, bills, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.put(`${url}/${data.id}`, bills, {
        headers: myheader?.headers,
      });

      dispatch(billsGetData(data));
      dispatch(customersGetData(data));
      dispatch(billsGetByCustomer(data));
      showSuccessAlert("Order Successfully Updated!");
      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while updating bill data."
      );
    }
  }
);

export const deleteBillsData = createAsyncThunk(
  "bills/deleteData",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const myheader = axiosWithToken(data);
      await axios.delete(`${url}/${id}`, { headers: myheader?.headers });

      Swal.fire("Deleted!", "Bill Record has been deleted.", "success").then(
        () => {
          dispatch(billsGetData(data));
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while deleting bill data."
      );
    }
  }
);

// Slice setup
const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    clearBillsState: (state) => {
      state.bills = [];
      state.billsByCustomer = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(billsGetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(billsGetData.fulfilled, (state, action) => {
        state.bills = action.payload;
        state.isLoading = false;
      })
      .addCase(billsGetData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
       // ...billsGetByCustomer
      .addCase(billsGetByCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(billsGetByCustomer.fulfilled, (state, action) => {
        state.billsByCustomer = action.payload;
        state.isLoading = false;
      })
      .addCase(billsGetByCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(postBillsData.pending, (state) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(postBillsData.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.bills = action.payload;
      })
      .addCase(postBillsData.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBillsData.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateBillsData.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.bills = action.payload;
      })
      .addCase(updateBillsData.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBillsData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearBillsState } = billsSlice.actions;
export default billsSlice.reducer;
