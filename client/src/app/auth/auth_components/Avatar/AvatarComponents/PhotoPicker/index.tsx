import { ChangeEvent } from "react";
import ReactDOM from "react-dom";

function PhotoPicker({
  photoPickerChange,
}: {
  photoPickerChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const component = (
    <input
      type="file"
      accept="image/*"
      hidden
      id="photo-picker"
      onChange={photoPickerChange}
    ></input>
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("photo-picker-element")
  );
}

export default PhotoPicker;
