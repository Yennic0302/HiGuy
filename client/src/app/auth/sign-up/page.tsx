/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";
import { HiGuyLogo, InputForm, Loader } from "@/global_components";
import { setUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { Google } from "@mui/icons-material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NotificationError from "../../../global_components/NotificationError";
import {
  signUpGoogleRequest,
  signUpRequest,
} from "../../../services/signUp.service";
import { Dictionary, ErrorsList, SignUpDataErrors } from "../../../types/auth";
import GoogleLoading from "../auth_components/GoogleLoading";

const initialStateErrors: SignUpDataErrors = {
  name: "",
  lastName: "",
  email: "",
  password: "",
};

const handleErrors = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // eslint-disable-next-line prettier/prettier
  anyError: SignUpDataErrors | Dictionary
) => {
  let errors: Dictionary = {};
  const element = e.currentTarget;

  let regexName = /^[a-zA-Z\s]+$/i;
  let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;

  if (!element.value.trim())
    errors[element.name] = `${element.name} can't be empty`;

  const valuesErrors = Object.values(anyError);

  let thereIsError;
  for (let value of valuesErrors) {
    if (value) thereIsError = true;
  }

  if (thereIsError) {
    if (element.name === "name") {
      if (element.value.length < 3 || element.value.length > 15)
        errors[
          element.name
        ] = `it should have minimum 3 and maximum 15 character`;
      else if (!regexName.test(element.value))
        errors[element.name] = `it can't have numbers `;
      else errors[element.name] = "";
    }

    if (element.name === "lastName") {
      if (element.value.length < 3 || element.value.length > 15)
        errors[
          element.name
        ] = `it should have minimum 3 and maximum 15 character`;
      else if (!regexName.test(element.value))
        errors[element.name] = `it can't have numbers `;
      else errors[element.name] = "";
    }

    if (element.name === "email") {
      if (!regexEmail.test(element.value))
        errors[element.name] = `please put valid email`;
      else errors[element.name] = "";
    }

    if (element.name === "password") {
      if (element.value.length < 8)
        errors[
          element.name
        ] = `${element.name} must have more than 8 characters`;
      else errors[element.name] = "";
    }
  }

  return errors;
};

const formattedErrors = (errorsList: ErrorsList[]): SignUpDataErrors => {
  let errors = initialStateErrors;
  errorsList.forEach((error) => {
    errors = { ...errors, [error.instancePath.slice(1)]: error.message };
  });

  return errors;
};

const SingUp = () => {
  const [errors, setErrors] = useState<SignUpDataErrors | Dictionary>(
    // eslint-disable-next-line prettier/prettier
    initialStateErrors
  );
  const [isThereError, setIsThereError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataFull, setIsDataFull] = useState<boolean>(false);
  const [errorGoogle, setErrorGoogle] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let thereIsError = false;

    const valuesFromError = Object.values(errors);
    for (let error of valuesFromError) {
      if (error) {
        thereIsError = true;
        break;
      }
    }

    setIsThereError(thereIsError);
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    let response;
    let thereIsError;

    const valuesErrors = Object.values(errors);
    for (let error of valuesErrors) {
      if (error) thereIsError = true;
    }

    if (!thereIsError) {
      response = await signUpRequest(data);
    }
    if (response) {
      if (!response.data.ok) {
        setErrors(formattedErrors(response.data.errors));
        setLoading(false);
        return;
      }

      if (response.data.ok) {
        dispatch(
          setUserData({
            isLoggedIn: true,
            userData: response.data.userData,
          })
        );
        router.push("./onboarding");
        return;
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(firebaseAuth, provider);
      const fullName = data.user.displayName?.split(" ");
      const name = fullName![0].trim();
      const lastName = fullName![1].trim();

      const dataToSend = {
        typeSingUp: "google",
        name,
        lastName,
        email: data.user.email?.trim(),
        profilePicture: data.user.photoURL,
      };

      const response = await signUpGoogleRequest(dataToSend);
      if (response) {
        if (!response.data.ok) {
          setErrorGoogle(response.data.statusText);
          setGoogleLoading(false);
          return;
        }
        if (response.data.ok) {
          dispatch(
            setUserData({
              isLoggedIn: true,
              userData: response.data.userData,
            })
          );
          router.push("./onboarding");
          setGoogleLoading(false);
          return;
        }
      }
    } catch {
      setGoogleLoading(false);
    }
  };

  const verifyDataIsFull = (e: React.FormEvent<HTMLFormElement>) => {
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const dataValues = Object.values(data);

    for (let value of dataValues) {
      if (!value) return setIsDataFull(false);
    }

    return setIsDataFull(true);
  };

  return (
    <section className="flex items-center relative w-screen h-screen bg-[var(--search-input-container-background)]  text-[var(--text-primary)]">
      <div className="container flex flex-col items-center justify-center m-auto h-full">
        <article className="flex flex-col p-8 gap-6">
          <div className="flex gap-2 items-center justify-center mb-5">
            <HiGuyLogo style="w-16 lg:w-24" />
            <h1 className="  text-center text-4xl lg:text-6xl font-bold">
              HiGuy
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-md"
            onChange={verifyDataIsFull}
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col">
                <InputForm
                  error={errors.name !== ""}
                  size="small"
                  label="Name"
                  name="name"
                  onChange={(e) =>
                    setErrors({ ...errors, ...handleErrors(e, errors) })
                  }
                  autoComplete="none"
                />
                <div className="h-6">
                  {errors.name && (
                    <span className="error h-full transition-text show-text ">
                      {errors.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <InputForm
                  error={errors.lastName !== ""}
                  size="small"
                  label="Last name"
                  name="lastName"
                  onChange={(e) =>
                    setErrors({ ...errors, ...handleErrors(e, errors) })
                  }
                  autoComplete="false"
                />
                <div className="h-6">
                  {errors.lastName && (
                    <span className="error h-full transition-text show-text ">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col ">
              <InputForm
                error={errors.email !== ""}
                size="small"
                label="Email"
                type="email"
                name="email"
                onChange={(e) =>
                  setErrors({ ...errors, ...handleErrors(e, errors) })
                }
                autoComplete="none"
              />
              <div className="h-6">
                {errors.email && (
                  <span className="error h-full transition-text show-text ">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <InputForm
                error={errors.password !== ""}
                size="small"
                label="Password"
                type="password"
                name="password"
                onChange={(e) =>
                  setErrors({ ...errors, ...handleErrors(e, errors) })
                }
                autoComplete="none"
              />
              <div className="h-6">
                {errors.password && (
                  <span className="error h-full transition-text show-text ">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>
            <div className=" w-full flex justify-center items-center">
              {!loading ? (
                <button
                  disabled={isThereError || !isDataFull}
                  className={`text-lg p-2 w-full h-10 rounded-[var(--standard-rounded)]  bg-[var(--dropdown-background)]  ${
                    isThereError || !isDataFull
                      ? "opacity-80 cursor-not-allowed"
                      : "hover:bg-[var(--dropdown-background-hover)] transition-all cursor-pointer"
                  }`}
                >
                  Sign Up
                </button>
              ) : (
                <button
                  disabled={loading}
                  className={`text-lg flex items-center h-10 justify-center p-2 w-full bg-[var(--dropdown-background)] rounded-[var(--standard-rounded)]  hover:bg-[var(--dropdown-background-hover)] transition-all ${
                    loading &&
                    "opacity-80 cursor-not-allowed hover:bg-[var(--dropdown-background)]"
                  }`}
                >
                  <Loader styleBall="h-2 w-2" gap="gap-2" />
                </button>
              )}
            </div>
          </form>
          <div className="flex items-center gap-2 w-full ">
            <hr className="w-full border-[var(--secondary)]" />
            <p className="text-[var(--secondary)]">or</p>
            <hr className="w-full border-[var(--secondary)]" />
          </div>
          <button
            onClick={handleGoogleSignUp}
            className="flex items-center text-xl justify-center w-full text-black bg-white rounded-full p-2 hover:bg-slate-300 transition-all gap-2"
          >
            <span>{<Google fontSize="inherit" />}</span>
            <p className="text-lg">sign up with Google</p>
          </button>
          <div className="flex justify-center gap-2 rounded-[var(--standard-rounded)] p-4 bg-[var(--panel-header-background)]">
            <p>Do you have a account?</p>
            <Link
              href="./sign-in"
              className="text-[var(--dropdown-background-hover)]"
            >
              Sign In
            </Link>
          </div>
        </article>
      </div>
      {errorGoogle && (
        <NotificationError error={errorGoogle} close={setErrorGoogle} />
      )}
      {googleLoading && <GoogleLoading />}
    </section>
  );
};

export default SingUp;
