/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";
import { HiGuyLogo, InputForm, Loader } from "@/global_components";
import NotificationError from "@/global_components/NotificationError";
import { setUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { signInGoogleRequest, signInRequest } from "@/services/signIn.service";
import {
  Dictionary,
  ErrorApi,
  ErrorsList,
  SignInDataErrors,
} from "@/types/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { Google } from "@mui/icons-material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleLoading } from "../auth_components";

const initialStateErrors: SignInDataErrors = {
  usernameOrEmail: "",
  password: "",
};
const formattedErrors = (errorsList: ErrorsList[]): SignInDataErrors => {
  let errors = initialStateErrors;
  errorsList.forEach((error) => {
    errors = { ...errors, [error.instancePath.slice(1)]: error.message };
  });

  return errors;
};

const SignIn = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string | null>(null);
  const [errorGoogle, setErrorGoogle] = useState<string>("");
  const [errors, setErrors] = useState<SignInDataErrors | Dictionary>(
    initialStateErrors
  );
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [isThereError, setIsThereError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataFull, setIsDataFull] = useState<boolean>(false);
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

  const identifyUsernameOrEmail = (data: string) => {
    let emailRegEx =
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    let usernameRegEx = /^[a-zA-Z0-9_-]{3,16}$/;
    if (usernameRegEx.test(data)) setUsernameOrEmail("username");
    if (emailRegEx.test(data)) setUsernameOrEmail("email");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const completeData = { ...data, typeToSignIn: usernameOrEmail };

    let response;

    if (!isThereError) {
      response = await signInRequest(completeData);
    }
    if (response) {
      if (!response.data.ok) {
        response.data.errors.forEach((error: ErrorApi) => {
          if (error.instancePath == "/google") {
            setErrorGoogle(error.message);
            setLoading(false);
            return;
          }
        });
        setErrors(formattedErrors(response.data.errors));
        return;
      }
      if (response.data.ok) {
        dispatch(
          setUserData({
            isLoggedIn: true,
            userData: response.data.userData,
          })
        );

        if (response.data.userData.isNewUser) router.push("./onboarding");
        else router.push("/");
        setLoading(false);
        return;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(firebaseAuth, provider);

      let response;
      if (data.user.email) {
        response = await signInGoogleRequest(data.user.email);
      } else
        setErrorGoogle("we can't set connection with google, please try again");

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

          if (response.data.userData.isNewUser) {
            router.push("./onboarding");
          } else {
            router.push("/");
          }
          setGoogleLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log(err);
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
        <article className="flex flex-col p-8 gap-4 w-full max-w-[25rem]">
          <div className="flex gap-2 items-center justify-center mb-5">
            <HiGuyLogo style="w-16 lg:w-24" />
            <h1 className="  text-center text-4xl lg:text-6xl font-bold">
              HiGuy
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            onChange={verifyDataIsFull}
            className="flex flex-col gap-6 max-w-md"
          >
            <div>
              <InputForm
                label="Username or Email"
                name="usernameOrEmail"
                size="small"
                className="w-full"
                autoComplete="none"
                onChange={(e) => {
                  setErrors(initialStateErrors);
                  identifyUsernameOrEmail(e.target.value.trim());
                }}
              />
              <div className="h-6">
                {errors.usernameOrEmail && (
                  <span className="error h-full transition-text show-text ">
                    {errors.usernameOrEmail}
                  </span>
                )}
              </div>
            </div>
            <div>
              <InputForm
                label="Password"
                size="small"
                className="w-full"
                autoComplete="none"
                type="password"
                name="password"
                onChange={() => {
                  setErrors(initialStateErrors);
                }}
              />
              <div className="h-6">
                {errors.password && (
                  <span className="error h-full transition-text show-text ">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            {!loading ? (
              <button
                disabled={isThereError || !isDataFull}
                className={`text-lg p-2 w-full h-10 rounded-[var(--standard-rounded)]  bg-[var(--dropdown-background)]  ${
                  isThereError || !isDataFull
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:bg-[var(--dropdown-background-hover)] transition-all cursor-pointer"
                }`}
              >
                Sing In
              </button>
            ) : (
              <button
                disabled={loading}
                className={`text-lg flex h-10 items-center justify-center p-2 w-full bg-[var(--dropdown-background)] rounded-[var(--standard-rounded)]  hover:bg-[var(--dropdown-background-hover)] transition-all ${
                  loading &&
                  "opacity-80 cursor-not-allowed hover:bg-[var(--dropdown-background)]"
                }`}
              >
                <Loader styleBall="h-2 w-2" gap="gap-2" />
              </button>
            )}
          </form>
          <div className="flex items-center gap-2 w-full ">
            <hr className="w-full border-[var(--secondary)]" />
            <p className="text-[var(--secondary)]">or</p>
            <hr className="w-full border-[var(--secondary)]" />
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center text-xl justify-center w-full text-black bg-white rounded-full p-2 hover:bg-slate-300 transition-all gap-2"
          >
            <span>{<Google fontSize="inherit" />}</span>
            <p className="text-lg">Sign in with Google</p>
          </button>
          <div className="flex flex-wrap gap-2 rounded-[var(--standard-rounded)] p-4 bg-[var(--panel-header-background)] w-full">
            <p className="">Do not you have an account?</p>
            <Link
              href="./sign-up"
              className="text-[var(--dropdown-background-hover)] self-start "
            >
              Sign Up
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

export default SignIn;
