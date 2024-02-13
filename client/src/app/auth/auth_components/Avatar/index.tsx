/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
import { setPropertyUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Camera } from "@mui/icons-material";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import {
  CapturePhoto,
  ContextMenu,
  PhotoLibrary,
  PhotoPicker,
} from "./AvatarComponents";

function Avatar({ type, image }: AvatarProperties) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [showPhotoLibrary, setShowPhotoLibrary] = useState<boolean>(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<number | null>(null);
  const [showCapturePhoto, setShowCapturePhoto] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const showContextMenu = (
    e: React.MouseEvent<HTMLElement | SVGSVGElement>
  ) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    const data = document.getElementById("photo-picker");
    if (grabPhoto && data) {
      data.click();
      /* document.body.onfocus = (e) => {
              setGrabPhoto(false);
            }; */
    }
  }, [grabPhoto]);

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setPhotoSelected(null);
        dispatch(
          setPropertyUserData({
            name: "profilePicture",
            value: "/default_avatar.png",
          })
        );
      },
    },
  ];

  const photoPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        if (event.currentTarget) {
          let picFile = event.currentTarget as FileReader;
          setPhotoSelected(null);
          dispatch(
            setPropertyUserData({
              name: "profilePicture",
              value: picFile.result,
            })
          );
          setGrabPhoto(false);
        }
      };
    }
  };

  return (
    <>
      <div className="flex items-center justify-center ">
        {type === "sm" && (
          <div className="relative overflow-hidden rounded-full h-10 w-10">
            <Image
              src={image}
              alt="avatar"
              className="w-full h-full object-cover "
              fill
            />
          </div>
        )}
        {type === "lg" && (
          <div className="relative overflow-hidden rounded-full h-14 w-14">
            <Image
              src={image}
              alt="avatar"
              className="rounded-full object-cover "
              fill
            />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onTouchStart={() => setHover(true)}
          >
            <div
              className={`bg-[var(--photopicker-overlay-background)] h-full w-full absolute top-0 left-0 flex items-center justify-center rounded-full flex-col text-center gap-2 z-20
              ${hover ? "visible" : "hidden"}`}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <Camera
                className="text-2xl "
                id="context-opener"
                onClick={(e) => {
                  // const htmlElement = e.target as HTMLElement;
                  // htmlElement.id = "context-opener";
                  showContextMenu(e);
                }}
              />
              <span id="context-opener" onClick={(e) => showContextMenu(e)}>
                Change profile photo
              </span>
            </div>
            <div className="relative rounded-full  flex items-center justify-center h-40 w-40 sm:h-60 sm:w-60 overflow-hidden">
              <Image
                src={image}
                alt="avatar"
                className="w-full h-full object-cover "
                fill
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          setHover={setHover}
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto
          setShowCapturePhoto={setShowCapturePhoto}
          setPhotoSelected={setPhotoSelected}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          hidePhotoLibrary={setShowPhotoLibrary}
          setPhotoSelected={setPhotoSelected}
          photoSelected={photoSelected}
        />
      )}
      {grabPhoto && <PhotoPicker photoPickerChange={photoPickerChange} />}
    </>
  );
}

export default Avatar;
