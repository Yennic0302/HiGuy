import axios from "axios";
import { AUTH_ROUTE } from "../utils/routes";
const checkUser = async () => {
  let checkUserEndPoint = `${AUTH_ROUTE}/check-user`;
  const controller = new AbortController();

  try {
    const result = await axios.get(checkUserEndPoint, {
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

export default checkUser;
