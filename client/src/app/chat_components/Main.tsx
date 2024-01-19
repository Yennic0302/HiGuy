/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import {
  updateReadContactChat,
  updateReceivingDelivered,
  updateWhenReceiving,
  updateWhenReceivingCurrentChat,
} from "@/redux/features/contactsChatsSlice";
import {
  addMessage,
  setMessagesData,
  updateMessage,
} from "@/redux/features/messageSlice";
import { setSocket } from "@/redux/features/socketSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMessages } from "@/services/message.service";
import { HOST } from "@/utils/routes";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chat, SearchMessage } from "./Chat";
import { ChatList } from "./Chatlist";
import Empty from "./Empty";
import Profile from "./profile";

export default function Main() {
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const userData = useAppSelector((state) => state.userReducer.userData);
  const messageSearch = useAppSelector(
    (state) => state.messageReducer.messageSearch
  );

  const dispatch = useAppDispatch();
  const socket = useRef<Socket>();
  const [socketEvent, setSocketEvent] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.interfaceReducer.profilePage);

  useEffect(() => {
    if (userData) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userData.id);
      dispatch(setSocket(socket.current));
    }
  }, [userData]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        let currentChat = JSON.parse(
          localStorage.getItem("currentChat") as string
        );
        if (currentChat?.id === data.from) {
          dispatch(addMessage(data.message));
          dispatch(updateWhenReceivingCurrentChat(data.message));
          socket.current?.emit("read-message", data.message);
        } else {
          dispatch(updateWhenReceiving(data.message));
        }
      });

      socket.current.on("update-read-message", (data) => {
        let currentChat = JSON.parse(
          localStorage.getItem("currentChat") as string
        );

        if (currentChat.id === data.recieverId) {
          dispatch(updateMessage(data));
        }
        dispatch(updateReadContactChat(data));
      });

      socket.current.on("update-read-from-sender", (data) => {
        let currentChat = JSON.parse(
          localStorage.getItem("currentChat") as string
        );
        if (currentChat.id === data.recieverId) {
          dispatch(updateMessage(data));
        }
        dispatch(updateReadContactChat(data));
      });

      socket.current.on("messages-delivered", (data) => {
        dispatch(updateReceivingDelivered(data));
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (currentChatData) {
      localStorage.setItem("currentChat", JSON.stringify(currentChatData));

      const fetchToMessages = async () => {
        const messages = await getMessages({
          from: userData!.id,
          to: currentChatData!.id,
        });

        if (messages?.data.ok) {
          const lastMessage = messages.data.messages.at(-1);
          dispatch(setMessagesData(messages.data.messages));

          if (lastMessage) {
            if (lastMessage.senderId !== userData?.id) {
              socket.current?.emit("update-read-from-reciever", lastMessage);
            }
          }
        }
      };

      fetchToMessages();
    } else {
      localStorage.setItem("currentChat", JSON.stringify({ data: null }));
    }
  }, [currentChatData]);

  return (
    <>
      <main className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-auto">
        <ChatList />
        {currentChatData ? (
          <div className={`${messageSearch ? "grid grid-cols-2" : ""} `}>
            <Chat />
            {messageSearch && <SearchMessage />}
          </div>
        ) : (
          <Empty />
        )}
        {profile.show && <Profile profileId={profile.profileId} />}
      </main>
    </>
  );
}
