/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
import { updateContactChat } from "@/redux/features/contactsChatsSlice";
import { addMessage } from "@/redux/features/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createAudioMessage } from "@/services/message.service";
import {
  Mic,
  PauseCircle,
  PlayArrow,
  Send,
  StopCircle,
} from "@mui/icons-material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import WaveSurfer from "wavesurfer.js";

export default function CaptureAudio({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const userData = useAppSelector((state) => state.userReducer.userData);
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const socket = useAppSelector((state) => state.socketReducer.socket);
  const dispatch = useAppDispatch();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<
    null | HTMLAudioElement | File
  >(null);
  const [waveForm, setWaveForm] = useState<null | WaveSurfer>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<null | HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<null | MediaRecorder>(null);
  const waveFormRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (waveFormRef.current !== null) {
      const wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#75418a",
        barWidth: 2,
        height: 30,
      });
      setWaveForm(wavesurfer);

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        wavesurfer.destroy();
      };
    }
  }, []);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setRecordedAudio(null);
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        if (audioRef.current !== null) {
          audioRef.current.srcObject = stream;
        }

        const chunks: any[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveForm?.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((error) => console.log(error.message));
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm?.stop();
    }

    const audioChunks: any[] = [];
    mediaRecorderRef.current?.addEventListener("dataavailable", (e) =>
      audioChunks.push(e.data)
    );

    mediaRecorderRef.current?.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioFile = new File([audioBlob], "recording.mp3");
      setRecordedAudio(audioFile);
    });
  };

  useEffect(() => {
    if (recordedAudio instanceof HTMLAudioElement) {
      const updatePlayBack = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };

      recordedAudio.addEventListener("timeupdate", updatePlayBack);
      return () =>
        recordedAudio.removeEventListener("timeupdate", updatePlayBack);
    }
  }, [recordedAudio]);

  const handlePLayRecording = () => {
    if (recordedAudio) {
      waveForm?.stop();
      waveForm?.play();
      if (recordedAudio instanceof HTMLAudioElement) recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm?.stop();
    if (recordedAudio instanceof HTMLAudioElement) recordedAudio.pause();

    setIsPlaying(false);
  };

  const sendRecording = async () => {
    const formData = new FormData();
    if (recordedAudio instanceof File) {
      formData.append("audio", recordedAudio);
      const response = await createAudioMessage(
        formData,
        userData!.id,
        currentChatData!.id
      );

      if (response?.status === 201) {
        dispatch(addMessage(response?.data.message));
        dispatch(updateContactChat(response?.data.message));

        setShow(false);
        if (socket != undefined) {
          socket.emit("send-message", {
            to: currentChatData!.id,
            from: userData!.id,
            message: response?.data.message,
          });
        }
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}: ${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="p-1">
        <AiFillDelete
          className="text-[--panel-header-icon]"
          onClick={() => setShow(false)}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-[--text-primary] text-lg flex gap-3 justify-center items-center bg-[--search-input-container-background] rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <PlayArrow onClick={handlePLayRecording} />
                ) : (
                  <StopCircle onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />

        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
      </div>

      <audio ref={audioRef} hidden />
      <div className="mr-4">
        {!isRecording ? (
          <Mic className="text-red-500" onClick={handleStartRecording} />
        ) : (
          <PauseCircle className="text-red-500" onClick={handleStopRecording} />
        )}
      </div>
      <div>
        <Send
          className={`   mr-4 ${
            recordedAudio
              ? " text-[--panel-header-icon] cursor-pointer"
              : "text-gray-500 cursor-not-allowed"
          }`}
          titleAccess="Send image"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
}
