import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";

const url = "dashboard";

export const countGetData = createAsyncThunk(
  "count/getData",
  async (data, { rejectWithValue }) => {
    try {
      const myheader = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`, 
      };
      let apiUrl = url;
      if (data?.companyId && data?.companyId !== "all") {
        apiUrl += `?company_id=${data?.companyId}`;
      }
      const response = await axios.get(apiUrl, {
        headers: myheader,
        // params: body,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching count data."
      );
    }
  }
);

const countSlice = createSlice({
  name: "count",
  initialState: {
    count: [],
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(countGetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(countGetData.fulfilled, (state, action) => {
        state.count = action.payload;
        state.isLoading = false;
      })
      .addCase(countGetData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default countSlice.reducer;
