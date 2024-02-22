/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { setContactsPage } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getContacts } from "@/services/contacts.service";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ChatListItem } from "..";
function ContactsList() {
  const [AllContacts, setAllContacts] = useState<object>([]);
  const userData = useAppSelector((state) => state.userReducer.userData);
  const onlineContacts = useAppSelector(
    (state) => state.contactsChatsReducer.onlineContacts
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getContactsFetch = async () => {
      if (userData !== undefined) {
        const response = await getContacts(userData.id);
        if (response?.data.ok) {
          setAllContacts(response.data.usersOrdered);
        }
      }
    };

    getContactsFetch();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className=" flex items-center h-16 px-4 py-3">
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
          <button onClick={() => dispatch(setContactsPage())}>
            <ArrowBack className="cursor-pointer text-xl" />
          </button>
          <span>Contacts</span>
        </div>
      </div>
      <div className="bg-[var(--search-input-container-background)] h-full flex-auto overflow-auto custom-scrollbar">
        {Object.entries(AllContacts).length > 0 ? (
          Object.entries(AllContacts).map(([initialLetter, userList]) => {
            return (
              <div key={Date.now() + initialLetter}>
                <div className="text-[var(--purple-light)] pl-10 py-5">
                  {initialLetter}
                </div>
                {userList.map((cont: Contact) => {
                  return (
                    <ChatListItem
                      data={cont.contact}
                      isContactPage={true}
                      key={cont.contact.id}
                      isOnline={onlineContacts?.includes(cont.contact.id)}
                    />
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex justify-center text-[--secondary] text-xl p-5 text-center">
            <h2>
              {"there aren't any contacts yet"}
              <br />
              {"come on and add some!"}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsList;
