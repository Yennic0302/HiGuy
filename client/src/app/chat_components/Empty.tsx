/* eslint-disable import/extensions */

import { HiGuyLogo } from "@/global_components";

export default function Empty() {
  return (
    <div className="hidden sm:flex border-[var(--conversation-border)] border-l w-full  bg-[var(--conversation-panel-background)] justify-center items-center relative h-screen border-b-4 border-b-[var(--icon-purple)]">
      <div className="flex gap-2 items-center">
        <HiGuyLogo style="w-32" />
        <h1 className="w-full mb-5 text-center text-6xl lg:text-8xl font-bold text-[--text-primary]">
          HiGuy
        </h1>
      </div>
    </div>
  );
}
