export type RegisterState = any | null;

const initialRegisterState: RegisterState = null;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const registerSlice = createSlice({
  name: "register",
  initialState: initialRegisterState,
  reducers: {
    reset: () => initialRegisterState,
    register: (state, action: PayloadAction<RegisterState>) => {
      return (state = action.payload);
    },
  },
});
export const { reset, register } = registerSlice.actions;

export default registerSlice.reducer;
