/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { CreatingMessage } from "@/types/message";
import { MESSAGE_ROUTE } from "@/utils/routes";
import axios from "axios";

export const createMessage = async (data: CreatingMessage) => {
  const urlToFetch = `${MESSAGE_ROUTE}/create`;
  const controller = new AbortController();
  try {
    const result = await axios.post(urlToFetch, data, {
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

export const createImgMessage = async (
  data: FormData,
  fromId: string,
  toId: string
) => {
  const urlToFetch = `${MESSAGE_ROUTE}/add/img-message`;
  const controller = new AbortController();
  try {
    const result = await axios.post(urlToFetch, data, {
      signal: controller.signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        from: fromId,
        to: toId,
      },
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

export const createAudioMessage = async (
  data: FormData,
  fromId: string,
  toId: string
) => {
  const urlToFetch = `${MESSAGE_ROUTE}/add/audio-message`;
  const controller = new AbortController();
  try {
    const result = await axios.post(urlToFetch, data, {
      signal: controller.signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        from: fromId,
        to: toId,
      },
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

export const getMessages = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}) => {
  const urlToFetch = `${MESSAGE_ROUTE}/get/${from}/${to}`;
  const controller = new AbortController();
  try {
    const result = await axios.get(urlToFetch, {
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

export const getInitialContactsWithMessages = async (from: string) => {
  const urlToFetch = `${MESSAGE_ROUTE}/contacts-with-message/${from}`;
  const controller = new AbortController();
  try {
    const result = await axios.get(urlToFetch, {
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
