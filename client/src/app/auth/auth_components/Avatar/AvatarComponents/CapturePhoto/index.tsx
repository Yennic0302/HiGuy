/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
import { setPropertyUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Check, Close } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

function CapturePhoto({
  setShowCapturePhoto,
  setPhotoSelected,
}: CapturePhotoProperties) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const [photoPreView, setPhotoPreview] = useState<string | undefined>(
    undefined
  );
  // const [error, setError] = useState(null);
  // const [audioSource, setAudioSource] = useState("");
  // const [videoSource, setVideoSource] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const prepareStream = async () => {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        const videoTarget = videoRef.current as HTMLVideoElement;
        videoTarget.srcObject = streamRef.current;
      }
    };
    prepareStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [photoPreView]);

  const setThePhoto = () => {
    dispatch(
      setPropertyUserData({
        name: "profilePicture",
        value: photoPreView,
      })
    );
    setShowCapturePhoto(false);
    setPhotoPreview(undefined);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      const canvasSource = videoRef.current as CanvasImageSource;
      const WIDTH = 600;
      const ratio = WIDTH / videoRef!.current!.videoWidth;
      const canvasHeight = ratio * videoRef!.current!.videoHeight;
      canvas.width = WIDTH;
      canvas.height = canvasHeight;
      ctx!.drawImage(canvasSource, 0, 0, WIDTH, canvasHeight);
      setPhotoPreview(canvas.toDataURL("image/jpg", 100));
    }
  };

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-[var(--search-input-container-background)] z-50 rounded-lg  flex items-center justify-center">
      <div className="relative flex flex-col gap-4 w-full max-w-[40rem] items-center justify-center">
        <div
          className="absolute  top-0 right-0   cursor-pointer flex items-center justify-center p-4"
          onClick={() => setShowCapturePhoto(false)}
        >
          <Close className="h-10 w-10 z-50 cursor-pointer " />
        </div>
        {photoPreView !== undefined ? (
          <div className="flex justify-center relative h-screen w-screen sm:h-full sm:w-full">
            <img
              src={photoPreView}
              className="w-full h-full object-cover "
              alt="photo preview"
            />
            <div className="absolute w-full flex justify-evenly bottom-4 ">
              <button onClick={() => setPhotoPreview(undefined)}>
                {<Close className="h-10 w-10 cursor-pointer" />}
              </button>
              <button onClick={setThePhoto}>
                {<Check className="h-10 w-10 cursor-pointer" />}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center h-screen w-screen sm:h-full sm:w-full"
            hidden={!Boolean(photoPreView)}
          >
            <video
              id="video"
              autoPlay
              className="w-full h-full object-cover"
              ref={videoRef}
            ></video>
          </div>
        )}
        {!photoPreView && (
          <button
            className=" absolute flex justify-center items-center bottom-0 h-16 w-16 bg-transparent rounded-full cursor-pointer border-4 border-[var(--text-primary)] p-2 mb-10"
            onClick={() => {
              capturePhoto();
              setPhotoSelected(null);
            }}
          >
            <span className="h-[90%] w-[90%] bg-[var(--text-primary)] rounded-full"></span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CapturePhoto;
