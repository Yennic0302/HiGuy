/* eslint-disable import/extensions */
"use client";
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
});

// export const metadata = {
//   title: "HiGuy",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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
          return;
        }
      }
    };

    checkSignedInUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
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
