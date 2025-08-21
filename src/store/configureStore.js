import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import { rootReducer } from "./reducer/combineReducer";
import logger from "redux-logger";

const persistConfig = {
  key: "laxmi-general-store",
  storage,
  debut: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStorage = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, REGISTER, PERSIST, PAUSE, PURGE],
        },
      }).concat(logger),
    devTools: process.env.NODE_ENV !== "production",
  });

  let persistor = persistStore(store);
  return { store, persistor };
};
