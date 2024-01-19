import "./style.css";
export default function Loader({
  size,
  color,
}: {
  size: string;
  color: string;
}) {
  return <span className={`loader  ${size} ${color}`}></span>;
}
