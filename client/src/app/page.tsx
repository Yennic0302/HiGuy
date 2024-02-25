/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";

import { setUserData } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import checkUser from "@/services/checkUser.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GoogleLoading } from "./auth/auth_components";
import Main from "./chat_components/Main";

export default function Home() {
  const userData = useAppSelector((state) => state.userReducer.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
        console.log("error");
        router.push("/auth/sign-in");
      }
    };

    checkSignedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{userData ? <Main /> : <GoogleLoading />}</>;
}
