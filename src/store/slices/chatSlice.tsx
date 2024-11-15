export type ChatState = {
  conversationId: number;
  contactId: number;
};

const initialRegisterState: ChatState = {
  conversationId: 0,
  contactId: 0,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialRegisterState,
  reducers: {
    resetChat: () => initialRegisterState,
    chatAndCall: (state, action: PayloadAction<ChatState>) => {
      return (state = action.payload);
    },
  },
});
export const { resetChat, chatAndCall } = chatSlice.actions;

export default chatSlice.reducer;
