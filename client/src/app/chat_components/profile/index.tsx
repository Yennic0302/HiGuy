/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";

import { GoogleLoading } from "@/app/auth/auth_components";
import { setCurrentChatData } from "@/redux/features/currentChatSlice";
import { setProfile } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addContact,
  getContacts,
  removeContact,
} from "@/services/contacts.service";
import { getProfile } from "@/services/profile.service";
import { Call, Chat, Close } from "@mui/icons-material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillVideoCamera } from "react-icons/ai";
import { BsFillPersonDashFill, BsPersonPlusFill } from "react-icons/bs";

export default function Profile({ profileId }: { profileId: string }) {
  const [profileData, setProfileData] = useState<null | ContactInfo>(null);
  const userData = useAppSelector((state) => state.userReducer.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [isContact, setIsContact] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setLoading(true);
    getProfile(profileId)
      .then((res) => {
        setProfileData(res.userData);
      })
      .catch(() => {
        console.error("Error on fetching user data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const getContactsFetch = async () => {
      if (userData !== undefined) {
        const response = await getContacts(userData.id);
        if (response?.data.ok) {
          const isInContact = response.data.users.some(
            (cont: any) => cont.contactId == profileId
          );

          setIsContact(isInContact);
        }
      }
    };

    getContactsFetch();
  }, [profileData]);

  const handleAddContact = async () => {
    const response = await addContact(userData!.id, profileData!.id);
    if (response?.data.ok) {
      setIsContact(!isContact);
    }
  };

  const handleRemoveContact = async () => {
    const response = await removeContact(userData!.id, profileData!.id);
    if (response?.data.ok) {
      setIsContact(!isContact);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[--bg-modal] flex  justify-center z-[100]">
      {userData && !loading && profileData ? (
        <div className="flex flex-col rounded-[--standard-rounded] max-w-[70vw] w m-auto bg-[--search-input-container-background] overflow-auto text-[--text-primary]">
          <nav className="bg-[--panel-header-background] px-10 py-5 flex justify-end  h-ful w-full">
            <Close
              className=" text-2xl"
              onClick={() =>
                dispatch(setProfile({ show: false, profileId: "" }))
              }
            />
          </nav>
          <div className="flex flex-wrap justify-center items-center gap-8 p-10 ">
            <div className="flex flex-col relative items-center justify-center">
              <div className="relative gap-2 h-60 w-60 ">
                <Image
                  src={profileData.profilePicture}
                  alt="user's avatar"
                  className="rounded-full  object-cover border-[10px] border-[--dropdown-background]"
                  fill
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-6xl text-[--dropdown-background]">
                {profileData.username}
              </h1>
              <div className="flex gap-2 text-xl">
                <h3>{profileData.name}</h3>
                <h3>{profileData.lastName}</h3>
              </div>
              <nav className="flex border border-[--secondary]  rounded-xl justify-evenly items-center gap-2 p-2">
                {isContact ? (
                  <BsFillPersonDashFill
                    className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                    titleacces="remove to contacts"
                    onClick={handleRemoveContact}
                  />
                ) : (
                  <BsPersonPlusFill
                    className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                    titleacces="add to contacts"
                    onClick={handleAddContact}
                  />
                )}
                <div className="h-[20px] w-[1px] bg-[--secondary]"></div>
                <Chat
                  className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                  titleAccess="Start chat"
                  onClick={() => {
                    dispatch(
                      setCurrentChatData({ currentChatData: profileData })
                    );
                    dispatch(
                      setProfile({
                        show: false,
                        profileId: "",
                      })
                    );
                  }}
                />
                <div className="h-[20px] w-[1px] bg-[--secondary]"></div>

                <Call
                  className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                  titleAccess="Start call"
                />
                <div className="h-[20px] w-[1px] bg-[--secondary]"></div>

                <AiFillVideoCamera
                  className="text-[var(--panel-header-icon)] cursor-pointer text-2xl"
                  titleaccess="Start video call"
                />
              </nav>
              {profileData.about.trim().length > 0 && (
                <div>
                  <span>About:</span>
                  <p className="text-lg text-[--secondary] px-4 py-1">
                    {profileData.about}
                  </p>
                </div>
              )}

              <p>Birth Day: {profileData.birthDay.substring(0, 10)}</p>
              <p>
                ID:{"  "}
                <span className="text-[--dropdown-background]">
                  {profileData.id}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <GoogleLoading />
      )}

      {!loading && !profileData && (
        <div className="max-w-[1360px] w-100vw   m-auto text-[--text-primary]">
          <h2>{"couldn't find the user"}</h2>
          <button>Return</button>
        </div>
      )}
    </div>
  );
}
