/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  contactsChats: any[] | undefined;
  onlineContacts: any[] | undefined;
} = {
  contactsChats: undefined,
  onlineContacts: undefined,
};
export const contactsChatsSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setContactsChats: (state, action) => {
      state.contactsChats = action.payload;
    },
    setOnlineContacts: (state, action) => {
      state.onlineContacts = action.payload;
    },
    updateContactChat: (state, action) => {
      const msgData = {};
      const msgPayload = action.payload;
      const contactsChats = state.contactsChats?.filter((msg) => {
        if (msg.id !== action.payload.recieverId) {
          return true;
        } else {
          let newMsg = {
            ...msg,
            type: msgPayload.type,
            message: msgPayload.message,
            createAt: msgPayload.createAt,
            messageStatus: state.onlineContacts?.includes(
              action.payload.recieverId
            )
              ? "delivered"
              : "sent",
            senderId: msgPayload.senderId,
            recieverId: msgPayload.recieverId,
          };
          Object.assign(msgData, newMsg);
        }
      });
      contactsChats?.unshift(msgData);
      state.contactsChats = contactsChats;
    },
    updateWhenReceiving: (state, action) => {
      const msgData = {};
      const msgPayload = action.payload;
      const contactsChats = state.contactsChats?.filter((msg) => {
        if (msg.id !== action.payload.senderId) {
          return true;
        } else {
          let newMsg = {
            ...msg,
            type: msgPayload.type,
            message: msgPayload.message,
            createAt: msgPayload.createAt,
            totalUnreadMessages: msg.totalUnreadMessages + 1,
            senderId: msgPayload.senderId,
            recieverId: msgPayload.recieverId,
          };
          Object.assign(msgData, newMsg);
        }
      });
      contactsChats?.unshift(msgData);
      state.contactsChats = contactsChats;
    },
    updateWhenReceivingCurrentChat: (state, action) => {
      const msgData = {};
      const msgPayload = action.payload;
      const contactsChats = state.contactsChats?.filter((msg) => {
        if (msg.id !== action.payload.senderId) {
          return true;
        } else {
          let newMsg = {
            ...msg,
            type: msgPayload.type,
            message: msgPayload.message,
            createAt: msgPayload.createAt,
            senderId: msgPayload.senderId,
            recieverId: msgPayload.recieverId,
          };
          Object.assign(msgData, newMsg);
        }
      });
      contactsChats?.unshift(msgData);
      state.contactsChats = contactsChats;
    },
    updateReadContactChat: (state, action) => {
      const newContactsChats = state.contactsChats?.map((msg) => {
        if (msg.id === action.payload.recieverId) {
          return { ...msg, messageStatus: "read", totalUnreadMessages: 0 };
        }
        return msg;
      });
      state.contactsChats = newContactsChats;
    },
    updateReceivingDelivered: (state, action) => {
      const newContactsChats = state.contactsChats?.map((msg) => {
        if (msg.id === action.payload) {
          return {
            ...msg,
            messageStatus: "delivered",
          };
        }
        return msg;
      });
      state.contactsChats = newContactsChats;
    },
  },
});

export const {
  setContactsChats,
  setOnlineContacts,
  updateContactChat,
  updateWhenReceiving,
  updateWhenReceivingCurrentChat,
  updateReadContactChat,
  updateReceivingDelivered,
} = contactsChatsSlice.actions;
export default contactsChatsSlice.reducer;
