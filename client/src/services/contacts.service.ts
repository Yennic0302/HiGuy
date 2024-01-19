/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
import { CONTACTS_ROUTE } from "@/utils/routes";
import axios from "axios";

export const getContacts = async (id: string) => {
  const urlToFetch = `${CONTACTS_ROUTE}/get-contacts/${id}`;
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

export const getUsers = async (search: string, user: string) => {
  const urlToFetch = `${CONTACTS_ROUTE}/get-users?search=${search}&user=${user}`;
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

export const addContact = async (userId: string, contactId: string) => {
  const urlToFetch = `${CONTACTS_ROUTE}/add/${userId}`;
  const controller = new AbortController();

  try {
    const result = await axios.post(
      urlToFetch,
      { contactId },
      {
        signal: controller.signal,
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
export const removeContact = async (userId: string, contactId: string) => {
  const urlToFetch = `${CONTACTS_ROUTE}/remove/${userId}`;
  const controller = new AbortController();

  try {
    const result = await axios.post(
      urlToFetch,
      { contactId },
      {
        signal: controller.signal,
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
