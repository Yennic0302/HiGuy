/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import { setMessageSearch } from "@/redux/features/messageSlice";
import { setVideoCall } from "@/redux/features/videoCallSlice";
import { setVoiceCall } from "@/redux/features/voiceCallSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Call, MoreVert, Search } from "@mui/icons-material";
import { AiFillVideoCamera } from "react-icons/ai";

export default function ChatHeader() {
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const dispatch = useAppDispatch();

  const handleVoiceCall = () => {
    dispatch(
      setVoiceCall({
        ...currentChatData,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      })
    );
  };

  const handleVideoCall = () => {
    dispatch(
      setVideoCall({
        ...currentChatData,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      })
    );
  };

  return (
    <>
      {currentChatData && (
        <div className="h-16 px-4 py-3 z-10 flex justify-between items-center bg-[var(--panel-header-background)]">
          <div className="flex items-center justify-center gap-6">
            <Avatar type="sm" image={currentChatData.profilePicture} />
            <div className="flex flex-col ">
              <span className="text-[--text-primary]">
                {currentChatData.username}
              </span>
              <span className="text-[--secondary] text-sm">online/offline</span>
            </div>
          </div>
          <div className="flex gap-6">
            <Call
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              onClick={handleVoiceCall}
            />
            <AiFillVideoCamera
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              onClick={handleVideoCall}
            />

            <Search
              className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
              onClick={() => dispatch(setMessageSearch())}
            />
            <MoreVert className="text-[var(--panel-header-icon)] cursor-pointer text-2xl " />
          </div>
        </div>
      )}
    </>
  );
}
