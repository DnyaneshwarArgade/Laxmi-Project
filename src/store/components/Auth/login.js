import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import customToast from "../../../Helpers/customToast";

// Define the API URLs for login and logout
const loginUrl = "auth/login";
const logoutUrl = "auth/logout";

export const postLogin = createAsyncThunk(
  "auth/postLogin",
  async ({ data, setSubmitting }, thunkAPI) => {
    try {
      const myheader = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const response = await axios.post(loginUrl, data, { headers: myheader });

      if (response?.data?.success) {
        const { name, company_id } = response?.data?.data;
        customToast(
          "success",
          
          `Login Successful! Welcome ${name}`,
          "top-end",
          2000
        );

        return response?.data;
      } else {
        customToast(
          "error",
          response?.data?.message || "Login Failed",
          "top-end",
          2000
        );
        return thunkAPI.rejectWithValue(
          response?.data?.message || "Login Failed"
        );
      }
    } catch (error) {
      customToast(
        "error",
        `Login Failed ${error.response?.data?.message}`,
        "top-end",
        2000
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    } finally {
      if (setSubmitting) {
        setSubmitting(false);
      }
    }
  }
);
export const postLogout = createAsyncThunk(
  "auth/postLogout",
  async (token, { dispatch, rejectWithValue }) => {
    console.log("token", token);
    try {
      const myheader = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token passed in the function
      };

      const response = await axios.post(logoutUrl, {}, { headers: myheader });

      if (response.data?.success) {
        customToast("success", response.data.message, "top-end", 1500);
      }

      return {}; // Return an empty object if logout is successful
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    errMess: null,
    login: [],
  },
  reducers: {
    logout: (state) => {
      state.isLoading = false;
      state.errMess = null;
      state.login = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.pending, (state) => {
        state.isLoading = true;
        state.errMess = null;
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.login = action.payload;
        state.errMess = null;
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.errMess = action.payload;
        state.login = [];
      })
      .addCase(postLogout.pending, (state) => {
        state.isLoading = true;
        state.errMess = null;
      })
      .addCase(postLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.login = [];
        state.errMess = null;
      })
      .addCase(postLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.errMess = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;
