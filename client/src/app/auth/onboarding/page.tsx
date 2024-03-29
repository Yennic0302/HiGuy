/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
// eslint-disable-next-line import/extensions
import { HiGuyLogo, InputForm, Loader } from "@/global_components";
import { setPropertyUserData, setUserData } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import checkUser from "@/services/checkUser.service";
import {
  checkUsername,
  setOnboardRequest,
} from "@/services/onboarding.service";
import { Check } from "@mui/icons-material";
import { FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Avatar,
  BirthDayPicker,
  BpRadio,
  GoogleLoading,
} from "../auth_components";
import "./style.css";

const Onboarding = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [showUsernameDetails, setUsernameDetails] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useAppSelector((state) => state.userReducer.userData);

  const checkUsernameChange = async (username: string) => {
    setUsernameDetails(true);

    const validUsername = username.trim().split(" ");

    let usernameRegEx = /^[a-zA-Z0-9_-]{3,16}$/;

    if (validUsername.length >= 2)
      return setUsernameError("Username can't have 2 or more words");

    if (username.trim().length <= 3 || username.trim().length > 16)
      return setUsernameError("Username must have between 3 and 16 chars");

    if (username.trim().length == 0)
      return setUsernameError("Username can't be empty");

    if (!usernameRegEx.test(username)) {
      if (username.slice(-1) == " ") return;
      return setUsernameError(
        `this "${username.slice(-1)}" is a invalid character`
      );
    }

    const response = await checkUsername(username);
    if (response?.data.ok) {
      if (response.data.isThereError)
        return setUsernameError(response?.data.statusText);
      setUsernameError("");
    }
  };

  useEffect(() => {
    const checkSignedInUser = async () => {
      const checkOutFinished = await checkUser();
      if (checkOutFinished?.data.ok) {
        dispatch(
          setUserData({
            isLoggedIn: true,
            userData: checkOutFinished.data.userData,
          })
        );
      } else {
        router.push("/auth/sign-in");
      }
    };

    checkSignedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const dataToSend = {
      username: userData?.username,
      profilePicture: userData?.profilePicture,
      about: userData?.about,
      birthDay: userData?.birthDay,
      gender: userData?.gender,
      isNewUser: false,
    };

    const response = await setOnboardRequest(dataToSend, userData?.id);

    if (usernameError || descriptionError != "") {
      return;
    }

    if (!response?.data.ok) {
      return setUsernameError(response?.data.statusText);
    }

    dispatch(
      setUserData({
        isLoggedIn: true,
        userData: response.data.userData,
      })
    );
    router.push("/");
    return;
  };

  return (
    <>
      {userData ? (
        <section className="flex items-center relative w-screen h-screen bg-[var(--search-input-container-background)] overflow-auto py-4 text-[var(--text-primary)]">
          <div className="container flex flex-col items-center justify-center m-auto  ">
            <div className="bg-panel-header-background w-full text-white flex flex-col items-center gap-6 justify-center  ">
              <div className="flex flex-col items-center gap-y-4">
                <div className="flex gap-2 items-center justify-center mb-5">
                  <HiGuyLogo style="w-16 lg:w-24" />
                  <h1 className="  text-center text-4xl lg:text-6xl font-bold">
                    HiGuy
                  </h1>
                </div>
                <h2 className=" text-lg sm:text-2xl">
                  Create your profile{" "}
                  <span className="text-[var(--dropdown-background)]">
                    {userData.name}
                  </span>
                </h2>
              </div>
              <div className="flex  gap-6  w-full justify-center flex-wrap">
                <div>
                  <Avatar type="xl" image={userData.profilePicture} />
                </div>
                <div className="flex flex-col items-center w-full max-w-[20rem] px-4 justify-center mt-5 gap-6">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 w-full"
                  >
                    <div>
                      <InputForm
                        label="Username"
                        name="username"
                        onChange={(e) => {
                          dispatch(
                            setPropertyUserData({
                              name: e.currentTarget.name,
                              value: e.currentTarget.value,
                            })
                          );
                          checkUsernameChange(e.target.value);
                        }}
                        error={Boolean(usernameError)}
                        size="small"
                        className="w-full pb-0"
                        autoComplete="none"
                      />
                      <div className="h-6 w-full">
                        {usernameError ? (
                          <span className="show-text error h-full  px-[1rem]">
                            {usernameError}
                          </span>
                        ) : (
                          showUsernameDetails && (
                            <span className="text-green-500 px-[1rem] show-text  h-full transition-text">
                              {<Check />}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <BirthDayPicker />
                    </div>

                    <div>
                      <FormLabel className="text-[--text-primary]" id="privacy">Profile privacy</FormLabel>
                      <RadioGroup
                        defaultValue="public"
                        name="privacy"
                        onChange={(e) =>
                          dispatch(
                            setPropertyUserData({
                              name: e.target.name,
                              value: e.target.value,
                            })
                          )
                        }
                      >
                        <FormControlLabel
                          value="public"
                          control={<BpRadio />}
                          label="public"
                        />
                        <FormControlLabel
                          value="private"
                          control={<BpRadio />}
                          label="private"
                        />
                      </RadioGroup>
                    </div>
                    <div>
                      <InputForm
                        label="About you (optional)"
                        name="about"
                        size="small"
                        className="w-full"
                        autoComplete="none"
                        onChange={(e) => {
                          if (e.target.value.length <= 140) {
                            dispatch(
                              setPropertyUserData({
                                name: e.target.name,
                                value: e.target.value,
                              })
                            );
                            setDescriptionError("");
                          } else {
                            setDescriptionError(
                              "About must be less than  140 characters"
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="h-4">
                      {descriptionError && (
                        <span className="error h-full transition-text show-text ">
                          {descriptionError}
                        </span>
                      )}
                    </div>
                    {!loading ? (
                      <button
                        disabled={Boolean(usernameError)}
                        className={`flex items-center mt-4 mb-4 justify-center text-lg p-2 w-full h-10 rounded-[var(--standard-rounded)]  bg-[var(--dropdown-background)]  ${
                          Boolean(usernameError)
                            ? "opacity-80 cursor-not-allowed"
                            : "hover:bg-[var(--dropdown-background-hover)] transition-all cursor-pointer"
                        }`}
                      >
                        create profile
                      </button>
                    ) : (
                      <button
                        disabled={loading}
                        className={`text-lg flex h-10 mt-4 mb-4  items-center justify-center p-2 w-full bg-[var(--dropdown-background)] rounded-[var(--standard-rounded)]  hover:bg-[var(--dropdown-background-hover)] transition-all ${
                          loading &&
                          "opacity-80 cursor-not-allowed hover:bg-[var(--dropdown-background)]"
                        }`}
                      >
                        <Loader styleBall="h-2 w-2" gap="gap-2" />
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <GoogleLoading />
      )}
    </>
  );
};

export default Onboarding;
