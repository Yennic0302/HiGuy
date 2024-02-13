/* eslint-disable prettier/prettier */
import axios from "axios";
import { ONBOARD_ROUTE } from "../utils/routes";

export const setOnboardRequest = async (
  data: object,
  id: string | undefined
) => {
  let urlSignIn = `${ONBOARD_ROUTE}/set-onboarding/${id}`;
  const controller = new AbortController();

  try {
    const result = await axios.post(urlSignIn, data, {
      signal: controller.signal,
    });

    setTimeout(() => {
      controller.abort();
    }, 10000);
    return result;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.response;
    }
  }
};

export const checkUsername = async (username: string) => {
  let urlSignIn = `${ONBOARD_ROUTE}/check-username/${username}`;

  const controller = new AbortController();

  try {
    const result = await axios.get(urlSignIn, {
      signal: controller.signal,
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
