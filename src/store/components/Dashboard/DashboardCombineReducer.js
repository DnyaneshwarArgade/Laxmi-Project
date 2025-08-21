import { combineReducers } from "redux";
import Count from "./count";

export const dashboardReducer = combineReducers({
  count: Count,
});
