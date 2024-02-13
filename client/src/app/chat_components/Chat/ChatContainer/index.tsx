/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
import { Loader } from "@/global_components";
import { useAppSelector } from "@/redux/hooks";
import { calculateTime } from "@/utils/CalculateTime";
import { AudioMessage, ImageMessage, MessageStatus } from "..";

export default function ChatContainer() {
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const messages = useAppSelector((state) => state.messageReducer.messages);
  const userData = useAppSelector((state) => state.userReducer.userData);

  return (
    <>
      {currentChatData ? (
        <div className="h-[80vh] backdrop-blur-md bg-[--conversation-panel-background]  w-full flex-grow overflow-auto custom-scrollbar">
          <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
            <div className=" flex w-full">
              <div className="flex flex-col justify-end w-full gap-2 overflow-auto">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentChatData.id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message.type === "text" && (
                      <div
                        className={`text-[var(--text-primary)] px-2 py-[5px] text-sm rounded-[var(--standard-rounded)] flex flex-col gap-2  max-w-[45%] ${
                          message.senderId === currentChatData.id
                            ? "bg-[var(--incoming-background)]"
                            : "outgoing-background items-end"
                        }`}
                      >
                        <span className="break-all">{message.message}</span>
                        <div className="flex gap-1 self-end items-end">
                          <span className="text-[var(--bubble-meta)] text-[11px] min-w-fit">
                            {calculateTime(message.createAt)}
                          </span>
                          <span>
                            {message.senderId === userData?.id && (
                              <MessageStatus status={message.messageStatus} />
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {message.type === "image" && (
                      <ImageMessage message={message} />
                    )}
                    {message.type === "audio" && (
                      <AudioMessage message={message} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          {<Loader size="medium" color="purple" />}
        </div>
      )}
    </>
  );
}
