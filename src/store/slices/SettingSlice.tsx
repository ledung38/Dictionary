export type SettingState = any | null;

const initialSettingState: SettingState = {
  openSideBar: false,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const settingSlice = createSlice({
  name: "setting",
  initialState: initialSettingState,
  reducers: {
    reset: () => initialSettingState,
    updateSetting: (state, action: PayloadAction<SettingState>) => {
      return (state = action.payload);
    },
  },
});
export const { reset, updateSetting } = settingSlice.actions;

export default settingSlice.reducer;
