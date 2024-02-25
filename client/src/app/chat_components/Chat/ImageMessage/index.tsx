/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { useAppSelector } from "@/redux/hooks";
import { MessageFromBackEnd } from "@/types/message";
import { calculateTime } from "@/utils/CalculateTime";
import { HOST } from "@/utils/routes";
import { MessageStatus } from "..";

export default function ImageMessage({
  message,
}: {
  message: MessageFromBackEnd;
}) {
  const currentChatUser = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const userData = useAppSelector((state) => state.userReducer.userData);

  return (
    <div
      className={` p-2 rounded-lg ${
        message.senderId === currentChatUser?.id
          ? "bg-[--incoming-background]"
          : "outgoing-background"
      } `}
    >
      <img
        src={`${HOST}/${message.message}`}
        alt="message-image"
        className="rounded-lg"
      />
      <div className=" flex justify-end pt-2 bottom-1 right-1 items-center gap-1">
        <span className="text-[var(--bubble-meta)] text-[11px] pt-1 min-w-fit">
          {calculateTime(message.createAt)}
        </span>
        <span className="text-[var(--bubble-meta)]">
          {message.senderId === userData?.id && (
            <MessageStatus status={message.messageStatus} />
          )}
        </span>
      </div>
    </div>
  );
}
