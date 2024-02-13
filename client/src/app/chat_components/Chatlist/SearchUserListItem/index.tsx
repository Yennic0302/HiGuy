/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import { setCurrentChatData } from "@/redux/features/currentChatSlice";
import { setProfile } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

function SearchUserListItem({ data }: { data: ContactInfo }) {
  const { currentChatReducer } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const handleProfile = () => {
    dispatch(setProfile({ show: true, profileId: data.id }));
  };

  const handleCurrentChat = () => {
    if (currentChatReducer.currentChatData?.id !== data.id) {
      dispatch(setCurrentChatData({ currentChatData: data }));
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-[var(--background-default-hover)] transition-all`}
    >
      <div onClick={handleProfile} className=" min-w-fit px-5 py-2 ">
        <Avatar type="lg" image={data.profilePicture} />
      </div>
      <div
        onClick={handleCurrentChat}
        className="min-h-full flex flex-col justify-center px-2 pt-3 pr-2 w-full cursor-pointer "
      >
        <div className="flex justify-between">
          <div>
            <span className="text-[var(--text-primary)]">{data.username}</span>
          </div>
        </div>
        <div className="flex border-b border-[var(--conversation-border)] pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full items-center">
            <span className="text-[var(--secondary)]">
              {data.about || "\u00A0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchUserListItem;
