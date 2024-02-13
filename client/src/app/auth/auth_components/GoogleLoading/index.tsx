/* eslint-disable import/extensions */
import { Loader } from "@/global_components";

export default function GoogleLoading() {
  return (
    <div className="fixed h-screen w-screen flex justify-center items-center top-0 left-0 z-50 bg-[var(--search-input-container-background)]">
      <Loader styleBall="h-5 w-5" gap="gap-4" />
    </div>
  );
}
