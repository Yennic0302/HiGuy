/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { useAppSelector } from "@/redux/hooks";
import { ChatListHeader, Contacts, List, SearchBar } from "..";
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
    <div className="bg-[var(--panel-header-background)] flex flex-col max-h-screen z-20">
      {!contactsPage && !searchPage && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {contactsPage && <Contacts />}
      {searchPage && <SearchUser />}
    </div>
  );
}

export default ChatList;
