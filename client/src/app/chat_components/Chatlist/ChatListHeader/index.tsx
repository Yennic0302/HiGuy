/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import {
  setContactsPage,
  setSearchPage,
  setUserProfile,
} from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Chat, Search } from "@mui/icons-material";

function ChatListHeader() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userReducer.userData);

  return (
    <>
      {userData && (
        <div className="h-16 px-4 py-3 flex justify-between items-center">
          <div
            onClick={() => dispatch(setUserProfile())}
            className="cursor-pointer"
          >
            <Avatar type="sm" image={userData.profilePicture} />
          </div>
          <div className="flex gap-6">
            <Search
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              onClick={() => dispatch(setSearchPage())}
            />
            <Chat
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              titleAccess="New chat"
              onClick={() => dispatch(setContactsPage())}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatListHeader;
