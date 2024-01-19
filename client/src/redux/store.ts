import { configureStore } from "@reduxjs/toolkit";
import contactsChatsReducer from "./features/contactsChatsSlice";
import currentChatReducer from "./features/currentChatSlice";
import interfaceReducer from "./features/interfaceSlice";
import messageReducer from "./features/messageSlice";
import socketReducer from "./features/socketSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    userReducer,
    currentChatReducer,
    interfaceReducer,
    messageReducer,
    socketReducer,
    contactsChatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
