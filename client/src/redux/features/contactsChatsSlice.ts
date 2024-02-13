/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  contactsChats: any[];
  onlineContacts: string[];
} = {
  contactsChats: [],
  onlineContacts: [],
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
    setOnlineContact: (state, action) => {
      state.onlineContacts = [...state.onlineContacts, action.payload];
    },
    removeOnlineContact: (state, action) => {
      const newOnlineUsers = state.onlineContacts.filter(
        (user) => user !== action.payload
      );
      state.onlineContacts = newOnlineUsers;
    },
    updateContactChat: (state, action) => {
      const msgData = {};
      const msgPayload = action.payload;

      const message = state.contactsChats?.find(
        (msg) => msg.id === action.payload.recieverId
      );
      if (message) {
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
        console.log(contactsChats);
        contactsChats?.unshift(msgData);
        state.contactsChats = contactsChats;
      } else {
        let newMsg = {
          profilePicture: msgPayload.reciever.profilePicture,
          type: msgPayload.type,
          message: msgPayload.message,
          username: msgPayload.reciever.username,
          createAt: msgPayload.createAt,
          messageStatus: state.onlineContacts?.includes(
            action.payload.recieverId
          )
            ? "delivered"
            : "sent",
          totalUnreadMessages: 0,
          id: msgPayload.recieverId,
          senderId: msgPayload.senderId,
          recieverId: msgPayload.recieverId,
        };
        state.contactsChats = [newMsg, ...state.contactsChats];
      }
    },
    updateWhenReceiving: (state, action) => {
      const msgData = {};
      const msgPayload = action.payload;
      const message = state.contactsChats?.find(
        (msg) => msg.id === action.payload.senderId
      );
      if (message) {
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
      } else {
        let newMsg = {
          profilePicture: msgPayload.sender.profilePicture,
          type: msgPayload.type,
          message: msgPayload.message,
          username: msgPayload.sender.username,
          createAt: msgPayload.createAt,
          totalUnreadMessages: 1,
          id: msgPayload.senderId,
          senderId: msgPayload.senderId,
          recieverId: msgPayload.recieverId,
        };
        state.contactsChats = [newMsg, ...state.contactsChats];
      }
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
  setOnlineContact,
  removeOnlineContact,
  updateContactChat,
  updateWhenReceiving,
  updateWhenReceivingCurrentChat,
  updateReadContactChat,
  updateReceivingDelivered,
} = contactsChatsSlice.actions;
export default contactsChatsSlice.reducer;
