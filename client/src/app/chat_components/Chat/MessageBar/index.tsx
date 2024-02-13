/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { PhotoPicker } from "@/app/auth/auth_components/Avatar/AvatarComponents";
import { updateContactChat } from "@/redux/features/contactsChatsSlice";
import { addMessage } from "@/redux/features/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createImgMessage, createMessage } from "@/services/message.service";
import { Attachment, EmojiEmotions, Mic, Send } from "@mui/icons-material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import CaptureAudio from "../CaptureAudio";
import ModalDiscardImage from "../ModalDiscardImage";

export default function MessageBar() {
  const currentChatData = useAppSelector(
    (state) => state.currentChatReducer.currentChatData
  );
  const socket = useAppSelector((state) => state.socketReducer.socket);
  const userData = useAppSelector((state) => state.userReducer.userData);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [prevImage, setPrevImage] = useState<string | null>(null);

  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [grabPhoto, setGrabPhoto] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);

  const emojiRef = useRef<HTMLDivElement | null>(null);
  const prevImageRef = useRef<HTMLDivElement | null>(null);
  const btnEmojiRef = useRef<any | null>(null);
  const btnReloadRef = useRef<any | null>(null);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendImgMessage = async () => {
    const formData = new FormData();
    if (image?.type.split("/")[0] == "image") {
      formData.append("image", image);
      const response = await createImgMessage(
        formData,
        userData!.id,
        currentChatData!.id
      );

      if (response?.status === 201) {
        console.log(response.data);
        dispatch(updateContactChat(response.data.message));
        dispatch(addMessage(response?.data.message));

        setGrabPhoto(false);
        setImage(null);
        setPrevImage(null);

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

  const photoPickerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null) {
      let fileToRead = e.currentTarget.files[0];
      setImage(e.currentTarget.files[0]);
      if (fileToRead?.type.split("/")[0] == "image") {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          setPrevImage(event.target?.result as string);
        });
        reader.readAsDataURL(fileToRead);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (btnEmojiRef && !btnEmojiRef.current?.contains(e.target))
        if (emojiRef.current) {
          if (!emojiRef.current.contains(e.target)) setShowEmojiPicker(false);
        }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClickImage = (e: any) => {
      if (
        prevImageRef.current &&
        btnReloadRef.current &&
        e.target.id !== "return-btn" &&
        e.target.id !== "photo-picker" &&
        e.target.id !== "btn-send-image"
      ) {
        if (!prevImageRef.current.contains(e.target)) setShowDiscardModal(true);
      }
    };
    document.addEventListener("click", handleOutsideClickImage);

    return () => {
      document.removeEventListener("click", handleOutsideClickImage);
    };
  }, []);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((msg) => (msg += emoji.emoji));
  };

  const sendMessage = async () => {
    const responseMessage = await createMessage({
      to: currentChatData!.id,
      from: userData!.id,
      message,
    });
    dispatch(addMessage(responseMessage?.data.message));
    dispatch(updateContactChat(responseMessage?.data.message));

    if (socket != undefined) {
      socket.emit("send-message", {
        to: currentChatData!.id,
        from: userData!.id,
        message: responseMessage?.data.message,
      });
    }
    setMessage("");
  };
  const activateInput = () => {
    const data = document.getElementById("photo-picker");
    if (data && grabPhoto) {
      data.click();
    }
  };

  useEffect(() => {
    activateInput();
  }, [grabPhoto]);

  const activateGrabPhoto = () => {
    setGrabPhoto(true);
  };

  const discard = () => {
    setImage(null);
    setPrevImage(null);
    setShowDiscardModal(false);
    setGrabPhoto(false);
  };
  const returnMedia = () => {
    setShowDiscardModal(false);
  };

  return (
    <>
      {currentChatData && (
        <div className="bg-[var(--panel-header-background)] h-20 px-4 flex items-center gap-6 relative">
          {!showAudioRecorder && (
            <>
              <div className="flex gap-6 ">
                <EmojiEmotions
                  className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                  titleAccess="Emoji"
                  id="emoji-open"
                  ref={btnEmojiRef}
                  onClick={handleEmojiModal}
                />
                {showEmojiPicker && (
                  <div ref={emojiRef} className="absolute bottom-24  z-40">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                  </div>
                )}
                {prevImage && (
                  <div
                    ref={prevImageRef}
                    className=" flex flex-col  absolute  bg-[--background-default-hover] rounded-[--standard-rounded] overflow-hidden max-w-[50rem]  bottom-5 mr-5  z-40"
                  >
                    <nav className=" flex justify-between p-4 bg-[--search-input-container-background]">
                      <button ref={btnReloadRef}>
                        <AiOutlineReload
                          className="text-[var(--panel-header-icon)] cursor-pointer text-2xl z-[100]"
                          titleaccess="reload image"
                          onClick={activateInput}
                        />
                      </button>

                      <AiFillDelete
                        className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                        titleaccess="Delete image"
                        onClick={() => {
                          setImage(null);
                          setPrevImage(null);
                          setGrabPhoto(false);
                        }}
                      />
                    </nav>
                    <Image
                      src={prevImage}
                      alt="message-img"
                      width={1200}
                      height={550}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: "80vh",
                        objectFit: "contain",
                      }}
                    />
                    <nav className=" p-2 flex justify-end bg-[--search-input-container-background]">
                      <button className=" flex justify-center items-center p-3 hover:bg-[--dropdown-background-hover] rounded-[--standard-rounded] bg-[--dropdown-background]">
                        <Send
                          className="  text-[--text-primary]  cursor-pointer "
                          titleAccess="Send image"
                          onClick={() => {
                            sendImgMessage();
                          }}
                          id="btn-send-image"
                        />
                      </button>
                    </nav>
                  </div>
                )}
                {showDiscardModal && (
                  <ModalDiscardImage
                    discard={discard}
                    returnMedia={returnMedia}
                  />
                )}
                <Attachment
                  className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                  titleAccess="Emoji"
                  onClick={() => activateGrabPhoto()}
                />
              </div>
              <div className="w-full rounded-lg h-10 flex items-center">
                <input
                  type="text"
                  name="message"
                  onChange={(e) => {
                    setMessage(e.currentTarget.value);
                  }}
                  value={message}
                  autoComplete="false"
                  placeholder="Type a message"
                  className="bg-[var(--input-background)] outline-none text-[var(--text-primary)] h-10 rounded-[var(--standard-rounded)] px-5 py-4 w-full"
                />
              </div>
              <div className="flex w-10 items-center justify-center ">
                {message.length > 0 ? (
                  <button onClick={() => sendMessage()}>
                    <Send
                      className="text-[var(--panel-header-icon)] cursor-pointer text-xl"
                      titleAccess="Send message"
                    />
                  </button>
                ) : (
                  <Mic
                    className="text-[var(--panel-header-icon)] cursor-pointer text-xl"
                    titleAccess="Record message"
                    onClick={() => setShowAudioRecorder(true)}
                  />
                )}
              </div>
            </>
          )}
          {grabPhoto && <PhotoPicker photoPickerChange={photoPickerChange} />}
          {showAudioRecorder && <CaptureAudio setShow={setShowAudioRecorder} />}
        </div>
      )}
    </>
  );
}
