/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { InitialStateCurrentChat } from "@/types/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: InitialStateCurrentChat = {
  currentChatData: undefined,
};
export const userSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChatData: (
      state,
      action: PayloadAction<InitialStateCurrentChat>
    ) => {
      state.currentChatData = action.payload.currentChatData;
    },
  },
});

export const { setCurrentChatData } = userSlice.actions;
export default userSlice.reducer;
