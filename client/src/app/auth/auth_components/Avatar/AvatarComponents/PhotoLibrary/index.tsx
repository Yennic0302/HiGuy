/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
import { setPropertyUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Close } from "@mui/icons-material";
import Image from "next/image";
import "./style.css";

function PhotoLibrary({
  hidePhotoLibrary,
  setPhotoSelected,
  photoSelected,
}: PhotoLibraryProperties) {
  const dispatch = useAppDispatch();

  const images = [
    "/avatars/1.jpg",
    "/avatars/2.jpg",
    "/avatars/3.jpg",
    "/avatars/4.jpg",
    "/avatars/5.jpg",
    "/avatars/6.jpg",
    "/avatars/7.jpg",
    "/avatars/8.jpg",
    "/avatars/9.jpg",
  ];

  return (
    <div className="fixed blur-in-expand top-0 z-50 left-0 h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="sm:h-max sm:w-max h-screen w-screen bg-[var(--input-background)] md:rounded-lg p-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h1 className="">Choose your picture</h1>
          <div
            className="cursor-pointer flex items-end justify-end"
            onClick={() => hidePhotoLibrary(false)}
          >
            <Close className=" cursor-pointer" />
          </div>
        </div>
        <div className=" flex flex-wrap  sm:grid sm:grid-cols-3  justify-center items-center gap-16 p-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                dispatch(
                  setPropertyUserData({
                    name: "profilePicture",
                    value: images[index],
                  })
                );
                setPhotoSelected(index);
                hidePhotoLibrary(false);
              }}
            >
              <div
                className={`h-24 w-24 relative cursor-pointer rounded-full overflow-hidden hover-avatar ${
                  photoSelected == index
                    ? "opacity-100 outline-[0.3rem] outline outline-[var(--dropdown-background)]"
                    : "opacity-50"
                } hover:opacity-100 transition-[0.2s]`}
              >
                <Image src={image} alt="avatar" fill />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
