/* eslint-disable import/no-extraneous-dependencies */
import { BsCheck, BsCheckAll } from "react-icons/bs";

export default function MessageStatus({ status }: { status: string }) {
  return (
    <>
      {status == "sent" && (
        <BsCheck className="text-lg text-[var(--bubble-meta)] " />
      )}
      {status == "delivered" && (
        <BsCheckAll className="text-lg text-[var(--bubble-meta)] " />
      )}
      {status == "read" && (
        <BsCheckAll className="text-lg text-[var(--icon-ack)]" />
      )}
    </>
  );
}
