/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import { setCurrentChatData } from "@/redux/features/currentChatSlice";
import { setMessageSearch } from "@/redux/features/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ArrowBack, Close, Search } from "@mui/icons-material";

export default function ChatHeader() {
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const dispatch = useAppDispatch();

  const handleCurrentChat = () => {
    localStorage.setItem("currentChat", JSON.stringify({ data: null }));
    dispatch(setCurrentChatData({ currentChatData: undefined }));
  };

  return (
    <>
      {currentChatData && (
        <div className="h-16 px-4 py-3 fixed w-full  z-10 flex justify-between items-center bg-[var(--panel-header-background)]">
          <div className="flex items-center justify-center gap-6">
            <span className=" hidden sm:block h-8 w-8">
              <Close
                className=" scale-[1.3] text-[--text-primary]"
                onClick={handleCurrentChat}
              />
            </span>
            <span className="block sm:hidden ">
              <ArrowBack
                className=" scale-[1.3] text-[--text-primary]"
                onClick={handleCurrentChat}
              />
            </span>
            <Avatar type="sm" image={currentChatData.profilePicture} />
            <div className="flex flex-col ">
              <span className="text-[--text-primary]">
                {currentChatData.username}
              </span>
              <span className="text-[--secondary] text-sm">
                {currentChatData.isOnline ? "online" : "offline"}
              </span>
            </div>
          </div>
          <div className="flex gap-6">
            <Search
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              onClick={() => dispatch(setMessageSearch())}
            />
          </div>
        </div>
      )}
    </>
  );
}
