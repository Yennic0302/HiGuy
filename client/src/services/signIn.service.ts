/* eslint-disable prettier/prettier */
import axios from "axios";
import { AUTH_ROUTE } from "../utils/routes";

export const signInRequest = async (data: object) => {
  let urlSignIn = `${AUTH_ROUTE}/sign-in`;
  const controller = new AbortController();
  try {
    const result = await axios.post(urlSignIn, data, {
      signal: controller.signal,
      withCredentials: true,
    });

    if (result) {
      return result;
    }

    setTimeout(() => {
      controller.abort();
    }, 10000);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.response;
    }
  }
};

export const signInGoogleRequest = async (email: string) => {
  let urlSignInGoogle = `${AUTH_ROUTE}/sign-in-google`;
  const controller = new AbortController();

  try {
    const result = await axios.post(
      urlSignInGoogle,
      { email },
      {
        signal: controller.signal,
        withCredentials: true,
      }
    );
    if (result) {
      return result;
    }

    setTimeout(() => {
      controller.abort();
    }, 10000);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.response;
    }
  }
};
