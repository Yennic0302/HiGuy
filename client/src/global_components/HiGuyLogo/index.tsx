export default function HiGuyLogo({ style }: { style: string }) {
  return (
    <img
      className={`${style} bg-[--text-primary] rounded-[--standard-rounded]`}
      src="/HiGuyLogo.svg"
      alt="logo"
    />
  );
}
