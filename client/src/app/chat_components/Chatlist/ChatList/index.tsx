/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { useAppSelector } from "@/redux/hooks";
import { ChatListHeader, Contacts, List } from "..";
import SearchUser from "../SearchUser";

function ChatList() {
  const contactsPage = useAppSelector(
    (state) => state.interfaceReducer.contactsPage
  );
  const searchPage = useAppSelector(
    (state) => state.interfaceReducer.searchPage
  );
  // const [pageType, setPageType] = useState<string>("default");

  // useEffect(() => {
  //   if (contactsPage) setPageType("contacts");
  //   else setPageType("default");
  // }, [contactsPage]);

  return (
    <div className="relative bg-[var(--panel-header-background)] flex flex-col max-h-screen z-20">
      {!contactsPage && !searchPage && (
        <>
          <ChatListHeader />
          <h2 className="text-2xl pt-16 w-full text-[--text-primary] p-4 bg-[--search-input-container-background]">
            Chats
          </h2>
          <List />
        </>
      )}
      {contactsPage && <Contacts />}
      {searchPage && <SearchUser />}
    </div>
  );
}

export default ChatList;
