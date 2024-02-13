/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";

import { setUserProfile } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Close } from "@mui/icons-material";
import Image from "next/image";

export default function UserProfile() {
  const userData = useAppSelector((state) => state.userReducer.userData);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[--bg-modal] flex  justify-center z-[100]">
      {userData ? (
        <div className="flex flex-col rounded-[--standard-rounded] max-w-[70vw] w m-auto bg-[--search-input-container-background] overflow-auto text-[--text-primary]">
          <nav className="bg-[--panel-header-background] px-10 py-5 flex justify-end  h-ful w-full">
            <Close
              className=" text-2xl"
              onClick={() => dispatch(setUserProfile())}
            />
          </nav>
          <div className="flex flex-wrap justify-center items-center gap-8 p-10 ">
            <div className="flex flex-col relative items-center justify-center">
              <div className="relative gap-2 h-60 w-60 ">
                <Image
                  src={userData.profilePicture}
                  alt="user's avatar"
                  className="rounded-full  object-cover border-[10px] border-[--dropdown-background]"
                  fill
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-6xl text-[--dropdown-background]">
                {userData.username}
              </h1>
              <div className="flex gap-2 text-xl">
                <h3>{userData.name}</h3>
                <h3>{userData.lastName}</h3>
              </div>

              {userData.about.trim().length > 0 && (
                <div>
                  <span>About:</span>
                  <p className="text-lg text-[--secondary] px-4 py-1">
                    {userData.about}
                  </p>
                </div>
              )}

              <p>Birth Day: {userData.birthDay.substring(0, 10)}</p>
              <p>
                ID:{"  "}
                <span className="text-[--dropdown-background]">
                  {userData.id}
                </span>
              </p>
              <nav>
                <button className="px-4 py-2 cursor-pointer bg-red-500 rounded-sm">
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
