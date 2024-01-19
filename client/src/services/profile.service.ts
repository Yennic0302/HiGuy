/* eslint-disable import/extensions */
import { PROFILE_ROUTE } from "@/utils/routes";
import axios from "axios";

export const getProfile = async (profileId: string) => {
  const urlToFetch = `${PROFILE_ROUTE}/get/${profileId}`;
  const controller = new AbortController();
  try {
    const result = await axios.get(urlToFetch, { signal: controller.signal });

    if (result) {
      return result.data;
    }

    setInterval(() => {
      controller.abort();
    }, 10000);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.response;
    }
  }
};
