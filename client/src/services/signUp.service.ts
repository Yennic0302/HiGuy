// eslint-disable-next-line import/extensions
import { AUTH_ROUTE } from "@/utils/routes";
import axios from "axios";

export const signUpRequest = async (data: object) => {
  let urlSignUp = `${AUTH_ROUTE}/sign-up`;
  const controller = new AbortController();

  try {
    const result = await axios.post(urlSignUp, data, {
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

export const signUpGoogleRequest = async (data: object) => {
  let urlSignUp = `${AUTH_ROUTE}/sign-up-google`;
  const controller = new AbortController();

  try {
    const result = await axios.post(urlSignUp, data, {
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
