/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { setMessageSearch } from "@/redux/features/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MessageFromBackEnd } from "@/types/message";
import { calculateTime } from "@/utils/CalculateTime";
import { Close, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function SearchMessage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const [searchedMessages, setSearchedMessages] = useState<
    MessageFromBackEnd[]
  >([]);

  const currentChatUser = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );

  const messages = useAppSelector((state) => state.messageReducer.messages);

  useEffect(() => {
    if (search.length > 0) {
      let messagesFiltered = messages?.filter(
        (message) => message.type === "text" && message.message.includes(search)
      );
      setSearchedMessages(messagesFiltered ?? []);
    } else setSearchedMessages([]);
  }, [search, messages]);

  return (
    <div className="absolute sm:relative border-[--border-conversation] border-1 w-full bg-[--conversation-panel-background] flex flex-col z-50 h-screen sm:max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-[--panel-header-background] text-[--text-primary]">
        <Close
          className="cursor-pointer text-[--text-primary] text-2xl"
          onClick={() => dispatch(setMessageSearch())}
        />
        <span>Search messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full ">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-[var(--panel-header-background)] flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <Search className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
              </div>
              <div>
                <input
                  placeholder="Search messages "
                  name="search"
                  className="bg-transparent text-sm outline-none text-[var(--text-primary)]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-[--secondary]">
            {!search.length &&
              `Search for messages with ${currentChatUser!.username}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {search.length > 0 && !searchedMessages.length && (
            <span className="text-[--secondary] w-full flex justify-center">
              No messages found
            </span>
          )}
          {
            <div className="flex flex-col w-full ">
              {searchedMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex cursor-pointer flex-col justify-center hover:bg-[--background-default-hover] w-full px-5 border-b-[0.1px] border-[--secondary] py-5"
                >
                  <div className="text-sm text-[--secondary]">
                    {calculateTime(message.createAt)}
                  </div>
                  <div className="text-[--icon-purple]">{message.message}</div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
