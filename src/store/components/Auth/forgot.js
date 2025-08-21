import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import customToast from "./../../../Helpers/customToast";

const forgotSlice = createSlice({
  name: "forgot",
  initialState: { isLoading: false, errMess: null, forgot: [] },
  reducers: {
    forgotSuccess: (state, action) => {
      state.forgot = action.payload;
      state.isLoading = false;
      state.errMess = null;
    },
    forgotFailure: (state, action) => {
      state.isLoading = false;
      state.errMess = action.payload;
    },
    forgotLoader: (state, action) => {
      state.isLoading = true;
      state.errMess = null;
    },
  },
});

export const { forgotSuccess, forgotFailure, forgotLoader } =
  forgotSlice.actions;

export default forgotSlice.reducer;

const url = "/forgot-password";

export const postForgot = (data, setSubmitting) => async (dispatch) => {
  dispatch(forgotLoader());
  try {
    const myheader = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const response = await axios.post(url, data, { headers: myheader });
    dispatch(forgotSuccess(response.data));
    customToast(
      "success",
      `Successfully Send Update Link on Your Email`,
      "top-end",
      1500
    );
    if (setSubmitting) {
      setSubmitting(false);
    }
  } catch (error) {
    dispatch(forgotFailure(error.message));
    customToast("error", `forgot Failed ${error.message}`, "top-end", 1500);
    if (setSubmitting) {
      setSubmitting(false);
    }
  }
};
