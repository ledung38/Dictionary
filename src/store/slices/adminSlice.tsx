import { createSlice } from "@reduxjs/toolkit";

export type AdminState = any | null;

const initialState: AdminState = null;

export const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: (state) => {
      state = null;
      return state;
    },
  },
});

export const { login, logout } = adminSlice.actions;

export default adminSlice.reducer;
