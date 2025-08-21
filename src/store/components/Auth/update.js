import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../shared/axios";
import customToast from "./../../../Helpers/customToast";

const updateSlice = createSlice({
  name: "update",
  initialState: { isLoading: false, errMess: null, update: [] },
  reducers: {
    updateSuccess: (state, action) => {
      state.update = action.payload;
      state.isLoading = false;
      state.errMess = null;
    },
    updateFailure: (state, action) => {
      state.isLoading = false;
      state.errMess = action.payload;
    },
    updateLoader: (state, action) => {
      state.isLoading = true;
      state.errMess = null;
    },
  },
});

export const { updateSuccess, updateFailure, updateLoader } =
  updateSlice.actions;

export default updateSlice.reducer;

const url = "/update-password";

export const postUpdate = (data, setSubmitting) => async (dispatch) => {
  dispatch(updateLoader());
  try {
    const myheader = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const response = await axios.post(url, data, { headers: myheader });
    dispatch(updateSuccess(response.data));
    customToast(
      "success",
      `Successfully Updated Your Password`,
      "top-end",
      1500
    );
    if (setSubmitting) {
      setSubmitting(false);
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    customToast("error", `update Failed ${error.message}`, "top-end", 1500);
    if (setSubmitting) {
      setSubmitting(false);
    }
  }
};
