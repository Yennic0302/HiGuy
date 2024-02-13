import "./style.css";

export default function Loader({
  styleBall,
  gap,
}: {
  styleBall: string;
  gap: string;
}) {
  return (
    <div className={`loader ${gap} `}>
      <span className={`ball ${styleBall}`}></span>
      <span className={`ball ${styleBall}`}></span>
      <span className={`ball ${styleBall}`}></span>
    </div>
  );
}
