import { Close } from "@mui/icons-material";
import { useEffect, useRef } from "react";
import "./style.css";

export default function NotificationError({
  error,
  close,
}: {
  error: string;
  close: (value: string) => void;
}) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const closeNotification = () => {
    notificationRef.current?.classList.add("slide-right");
    setTimeout(() => close(""), 400);
  };
  useEffect(() => {
    if (notificationRef && error != "") {
      notificationRef.current?.classList.add("slide-left");
      setTimeout(() => {
        closeNotification();
      }, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div
      ref={notificationRef}
      className="notification justify-center gap-2 rounded-[var(--standard-rounded)] p-2 bg-[var(--panel-header-background)]"
    >
      <nav className="w-full ">
        <ul>
          <li
            className="cursor-pointer pt-2"
            onClick={() => closeNotification()}
          >
            {<Close />}
          </li>
        </ul>
      </nav>
      <p className="text-lg">{error}</p>
    </div>
  );
}
