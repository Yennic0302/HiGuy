/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { MessageFromBackEnd } from "@/types/message";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  messages: MessageFromBackEnd[] | undefined;
  messageSearch: boolean | undefined;
} = {
  messages: undefined,
  messageSearch: undefined,
};
export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessagesData: (
      state,
      // eslint-disable-next-line prettier/prettier
      action: PayloadAction<MessageFromBackEnd[]>
    ) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      if (state.messages != undefined) {
        state.messages = [...state.messages, action.payload];
      } else {
        state.messages = [action.payload];
      }
    },
    setMessageSearch: (state) => {
      state.messageSearch = !state.messageSearch;
    },
    updateMessage: (state, action) => {
      const newMessages = state.messages?.map((msg) => {
        if (msg.id === action.payload.id) {
          return { ...msg, messageStatus: "read" };
        }
        return msg;
      });
      state.messages = newMessages;
    },
  },
});

export const { setMessagesData, addMessage, setMessageSearch, updateMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
