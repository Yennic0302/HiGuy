/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { Avatar } from "@/app/auth/auth_components";
import { useAppSelector } from "@/redux/hooks";
import { MessageFromBackEnd } from "@/types/message";
import { calculateTime } from "@/utils/CalculateTime";
import { HOST } from "@/utils/routes";
import { PlayArrow, StopCircle } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { MessageStatus } from "..";

export default function AudioMessage({
  message,
}: {
  message: MessageFromBackEnd;
}) {
  const [audioMessage, setAudioMessage] = useState<null | HTMLAudioElement>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const userData = useAppSelector((state) => state.userReducer.userData);
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );

  const waveFormRef = useRef<HTMLDivElement | null>(null);
  const waveForm = useRef<null | WaveSurfer>(null);

  const handlePLayAudio = () => {
    if (audioMessage && waveForm.current) {
      waveForm.current.stop();
      waveForm.current.play();
      if (audioMessage instanceof HTMLAudioElement) audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    waveForm.current!.stop();
    if (audioMessage instanceof HTMLAudioElement) audioMessage.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioMessage instanceof HTMLAudioElement) {
      const updatePlayBack = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };

      audioMessage.addEventListener("timeupdate", updatePlayBack);
      return () =>
        audioMessage.removeEventListener("timeupdate", updatePlayBack);
    }
  }, [audioMessage]);

  useEffect(() => {
    if (waveForm.current === null && waveFormRef.current) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#111",
        barWidth: 2,
        height: 30,
      });

      waveForm.current!.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        waveForm.current!.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}`;
    const audio = new Audio(audioUrl);
    setAudioMessage(audio);
    waveForm.current?.load(audioUrl);
    waveForm.current?.on("ready", () => {
      setTotalDuration(waveForm.current!.getDuration());
    });
  }, [message.message]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}: ${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={` flex items-center gap-5 text-[--text-primary] px-4 py-4 text-sm rounded-md w-ful  ${
        message.senderId === currentChatData?.id
          ? "bg-[--incoming-background]"
          : "outgoing-background"
      } `}
    >
      <div>
        <Avatar
          type="sm"
          image={
            message.senderId === userData!.id
              ? userData!.profilePicture
              : currentChatData!.profilePicture
          }
        />
      </div>

      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <PlayArrow onClick={handlePLayAudio} />
        ) : (
          <StopCircle onClick={handlePauseAudio} />
        )}
      </div>

      <div className="relative">
        <div className=" w-44 sm:w-60" ref={waveFormRef} />
        <div className="text-[--bubble-meta] text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createAt)}</span>
            {message.senderId === userData?.id && (
              <MessageStatus status={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
