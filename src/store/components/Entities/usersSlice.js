import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import Swal from "sweetalert2";
import { axiosWithToken } from "../../../utils/axiosUtils";
import { showSuccessAlert } from "../../../utils/alertUtils";
import { showErrorAlert } from "../../../utils/alertUtils";

const url = "/users";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    error: null,
    isLoading: false,
    isPostLoading: false,
    isUpdateLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(usersGetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(usersGetData.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(usersGetData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(postUsersData.pending, (state) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(postUsersData.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.users = action.payload;
      })
      .addCase(postUsersData.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUsersData.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateUsersData.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.users = action.payload;
      })
      .addCase(updateUsersData.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUsersData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const usersGetData = createAsyncThunk(
  "users/getData",
  async (data, { rejectWithValue }) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.get(url, {
        headers: myheader?.headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postUsersData = createAsyncThunk(
  "users/postData",
  async (
    { data, users, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    console.log("data post", data);
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.post(url, users, {
        headers: myheader?.headers,
      });

      dispatch(usersGetData(data));
      showSuccessAlert("Successfully Created !");
      if (toggle) toggle();
      if (setSubmitting) setSubmitting(false);

      return response.data;
    } catch (error) {
      let errorMessage;

      if (error?.response?.data?.errors?.email) {
        errorMessage = error?.response?.data?.errors?.email[0];
      } else if (error?.response?.status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Internal server error. Please try again later.";
      }
      // Handle network-related errors or unexpected errors
      else if (error?.message) {
        errorMessage = error.message || "An unexpected error occurred.";
      } else {
        errorMessage = "An unknown error occurred.";
      }

      // Show the error message using the alert function
      showErrorAlert(errorMessage);

      if (setSubmitting) setSubmitting(false);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUsersData = createAsyncThunk(
  "users/updateData",
  async (
    { data, users, toggle, setSubmitting },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const myheader = axiosWithToken(data);
      const response = await axios.put(`${url}/${data.id}`, users, {
        headers: myheader?.headers,
      });
      dispatch(usersGetData(data));
      showSuccessAlert("Successfully Updated !");
      if (toggle) toggle();
      if (setSubmitting) setSubmitting(false);

      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.errors?.email
        ? error?.response?.data?.errors?.email[0]
        : error?.message || "An unexpected error occurred.";
      showErrorAlert(errorMessage);
      if (setSubmitting) setSubmitting(false);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUsersData = createAsyncThunk(
  "users/deleteData",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const myheader = axiosWithToken(data);
      await axios.delete(`${url}/${id}`, { headers: myheader?.headers });
      Swal.fire("Deleted!", "Your Record has been deleted.", "success").then(
        () => {
          dispatch(usersGetData(data));
        }
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default usersSlice.reducer;
