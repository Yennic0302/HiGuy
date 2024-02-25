/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */

import {
  setContactsChats,
  setOnlineContacts,
} from "@/redux/features/contactsChatsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getInitialContactsWithMessages } from "@/services/message.service";
import { Search } from "@mui/icons-material";
import { useEffect } from "react";
import ChatLIstItem from "../ChatListItem";

function List() {
  const userData = useAppSelector((state) => state.userReducer.userData);
  const { contactsChats, onlineContacts } = useAppSelector(
    (state) => state.contactsChatsReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchToInitialContacts = async () => {
      const response = await getInitialContactsWithMessages(userData!.id);
      if (response?.data.ok) {
        console.log(response.data.onlineUsers);
        dispatch(setContactsChats(response.data.users));
        dispatch(setOnlineContacts(response.data.onlineUsers));
      }
    };

    fetchToInitialContacts();
  }, [userData]);

  return (
    <div className="relative h-[80vh] bg-[var(--search-input-container-background)] flex-auto overflow-auto max-h-full custom-scrollbar">
      {contactsChats.length > 0 ? (
        contactsChats.map((contact: ContactInfo) => (
          <ChatLIstItem
            isContactPage={false}
            data={contact}
            key={contact.id}
            isOnline={onlineContacts?.includes(contact.id)}
          />
        ))
      ) : (
        <div className="h-full w-full flex justify-center text-[--secondary] text-xl p-5 text-center">
          <h2>
            {"Let's start chat, you can search people to talk to in "}
            <Search className="text-[var(--panel-header-icon)] cursor-pointer text-2xl" />
          </h2>
        </div>
      )}
    </div>
  );
}

export default List;
