import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import Swal from "sweetalert2";
import { axiosWithToken } from "../../../utils/axiosUtils";
import { showSuccessAlert, showErrorAlert } from "../../../utils/alertUtils";

const url = "/items"; // Change URL to /items for the items API endpoint

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  isPostLoading: false,
  isUpdateLoading: false,
};

export const itemsGetData = createAsyncThunk(
  "items/getData",
  async (data, { rejectWithValue }) => {
    try {
      const myheader = axiosWithToken(data);

      const response = await axios.get(url, {
        headers: myheader?.headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching item data."
      );
    }
  }
);

export const postItemsData = createAsyncThunk(
  "items/postData",
  async (
    { data, formData, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    console.log('data', data)
    console.log('formData', formData)

    try {
      const myheader = axiosWithToken(data, true);
      const response = await axios.post(url, formData, {
        headers: myheader?.headers,
      });

      dispatch(itemsGetData(data));
      showSuccessAlert("Item Successfully Created!");
      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while posting item data."
      );
    }
  }
);

export const updateItemsData = createAsyncThunk(
  "items/updateData",
  async (
    { data, items, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data, true);
      const response = await axios.post(
        `${url}/${data.id}?_method=PATCH`,
        items,
        {
          headers: myheader?.headers,
        }
      );

      dispatch(itemsGetData(data));
      showSuccessAlert("Item Successfully Updated!");
      toggle?.();
      setSubmitting?.(false);

      return response.data;
    } catch (error) {
      setSubmitting?.(false);
      return rejectWithValue(
        error.message || "An error occurred while updating item data."
      );
    }
  }
);

export const deleteItemsData = createAsyncThunk(
  "items/deleteData",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const myheader = axiosWithToken(data);
      await axios.delete(`${url}/${id}`, { headers: myheader?.headers });

      Swal.fire("Deleted!", "Item Record has been deleted.", "success").then(
        () => {
          dispatch(itemsGetData(data));
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while deleting item data."
      );
    }
  }
);

// Slice setup
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(itemsGetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(itemsGetData.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(itemsGetData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(postItemsData.pending, (state) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(postItemsData.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.items = action.payload;
      })
      .addCase(postItemsData.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(updateItemsData.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateItemsData.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.items = action.payload;
      })
      .addCase(updateItemsData.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteItemsData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default itemsSlice.reducer;
