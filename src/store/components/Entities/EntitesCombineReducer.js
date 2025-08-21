import { combineReducers } from "redux";
import Users from "./usersSlice";
import Customers from "./customersSlice";
import Bills from "./billsSlice";
import Items from "./itemsSlice";

export const entitesReducer = combineReducers({
  users: Users,
  customers: Customers,
  bills: Bills,
  items: Items,
});
