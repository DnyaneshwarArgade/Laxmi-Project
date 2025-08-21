import { combineReducers } from "redux";
import Login from "../components/Auth/login";
import Forgot from "../components/Auth/forgot";
import Update from "../components/Auth/update";
import { dashboardReducer } from "../components/Dashboard/DashboardCombineReducer";
import {entitesReducer} from "../components/Entities/EntitesCombineReducer";

export const rootReducer = combineReducers({
  login: Login,
  forgot: Forgot,
  update: Update,
  entities: entitesReducer,
  dashboard: dashboardReducer,
});
