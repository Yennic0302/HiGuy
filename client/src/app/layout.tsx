"use client";
import { setUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import Providers from "@/redux/providers";
import checkUser from "@/services/checkUser.service";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleLoading } from "./auth/auth_components";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    const checkSignedInUser = async () => {
      const checkOutFinished = await checkUser();
      if (!checkOutFinished?.data.ok) {
        setLoading(false);
        return router.push("/auth/sign-in");
      }

      if (checkOutFinished.data.ok) {
        setLoading(false);
        if (checkOutFinished.data.userData.isNewUser) {
          return router.push("/auth/onboarding");
        } else {
          dispatch(
            setUserData({
              isLoggedIn: true,
              userData: checkOutFinished.data.userData,
            })
          );
          return;
        }
      }
    };

    checkSignedInUser();
  }, []);

  return (
    <html lang="en">
      <meta
        name="description"
        content="HiGuy a chat where you can enjoy to talk to people"
      />
      <link rel="icon" href="/HiGuyLogo.ico" sizes="any" />
      <title>HiGuy</title>
      <Providers>
        <body className={roboto.className}>
          {children}
          <div id="photo-picker-element"></div>
          <div id="modal-discard-media"></div>
          {loading && <GoogleLoading />}
        </body>
      </Providers>
    </html>
  );
}
