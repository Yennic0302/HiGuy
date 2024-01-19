/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import { updateReadContactChat } from "@/redux/features/contactsChatsSlice";
import { setCurrentChatData } from "@/redux/features/currentChatSlice";
import { setContactsPage, setProfile } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { calculateTime } from "@/utils/CalculateTime";
import { Image, Mic } from "@mui/icons-material";
import { MessageStatus } from "../../Chat";

function ChatLIstItem({ data, isContactPage = false }: ChatListItemProperties) {
  const { currentChatReducer } = useAppSelector((state) => state);
  const userData = useAppSelector((state) => state.userReducer.userData);

  const dispatch = useAppDispatch();

  const handleProfile = () => {
    dispatch(setProfile({ show: true, profileId: data.id }));
  };

  const handleCurrentChat = () => {
    if (data.totalUnreadMessages! > 0 && data.senderId !== userData!.id) {
      dispatch(updateReadContactChat({ recieverId: data.id }));
    }
    if (!isContactPage) {
      dispatch(
        setCurrentChatData({
          currentChatData: {
            id: data.id,
            username: data.username,
            name: data.name,
            lastName: data.lastName,
            profilePicture: data.profilePicture,
            about: data.about,
            birthDay: data.birthDay,
            email: data.email,
          },
        })
      );
    } else {
      if (currentChatReducer.currentChatData?.id !== data.id) {
        dispatch(setCurrentChatData({ currentChatData: data }));
        return dispatch(setContactsPage());
      }

      return dispatch(setContactsPage());
    }
  };

  return (
    <div className={`flex cursor-pointer items-center `}>
      <div onClick={handleProfile} className=" min-w-fit px-5 py-2 ">
        <Avatar type="lg" image={data.profilePicture} />
      </div>
      <div
        onClick={handleCurrentChat}
        className="min-h-full flex flex-col justify-center px-2 pt-3 pr-2 w-full cursor-pointer hover:bg-[var(--background-default-hover)]"
      >
        <div className="flex justify-between">
          <div>
            <span className="text-[var(--text-primary)]">{data.username}</span>
          </div>
          {!isContactPage && (
            <div>
              <span
                className={`${
                  data.totalUnreadMessages! > 0
                    ? "text-[--icon-purple]"
                    : "text-[--secondary]"
                } text-sm`}
              >
                {calculateTime(data.createAt!)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-[var(--conversation-border)] pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full items-center">
            <span className="text-[var(--secondary)]">
              {isContactPage ? (
                data.about || "\u00A0"
              ) : (
                <div
                  className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px]
              md:max-w-[300] lg:max-w-[200px] xl:max-w-[300px]"
                >
                  {data.senderId === userData!.id && (
                    <MessageStatus status={data.messageStatus!} />
                  )}
                  {data.type === "text" && (
                    <span className="truncate">{data.message}</span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <Mic className="text-[--panel-header-icon]" />
                      Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <Image className="text-[--panel-header-icon]" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data.totalUnreadMessages! > 0 && (
              <span className="bg-[--icon-purple] px-[6px] rounded-full text-sm">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
