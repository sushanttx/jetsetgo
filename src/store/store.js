import { configureStore } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";
import authSlice from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    hero: findPlaceSlice,
    auth: authSlice,
  },
});
