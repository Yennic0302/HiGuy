/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";

import { useAppSelector } from "@/redux/hooks";
import { GoogleLoading } from "./auth/auth_components";
import Main from "./chat_components/Main";

export default function Home() {
  const userData = useAppSelector((state) => state.userReducer.userData);

  return <>{userData ? <Main /> : <GoogleLoading />}</>;
}
