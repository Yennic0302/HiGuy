/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { setContactsPage } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getContacts } from "@/services/contacts.service";
import { ArrowBack, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ChatListItem } from "..";
function ContactsList() {
  const [AllContacts, setAllContacts] = useState<object>([]);
  const userData = useAppSelector((state) => state.userReducer.userData);
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
          <span>Your contacts</span>
        </div>
      </div>
      <div className="bg-[var(--search-input-container-background)] h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-[var(--panel-header-background)] flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <Search className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
            </div>
            <div>
              <input
                placeholder="Search contact "
                name="search"
                className="bg-transparent text-sm outline-none text-[--text-primary]"
              />
            </div>
          </div>
        </div>
        {Object.entries(AllContacts).map(([initialLetter, userList]) => {
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
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
