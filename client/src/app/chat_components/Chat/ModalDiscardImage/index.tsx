/* eslint-disable prettier/prettier */
import ReactDOM from "react-dom";

function ModalDiscardImage({
  discard,
  returnMedia,
}: {
  discard: () => void;
  returnMedia: () => void;
}) {
  const component = (
    <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen bg-[--photopicker-overlay-background] z-50 ">
      <div className="flex w-[50rem] flex-col text-xl text-[--text-primary] rounded-[--standard-rounded] bg-[--background-default-hover]">
        <h1 className="p-8">Discard unsent media?</h1>
        <nav className="p-8 bg-[--search-input-container-background] flex justify-evenly">
          <button onClick={discard} className="p-2">
            Discard
          </button>
          <button id="return-btn" onClick={returnMedia} className="p-2">
            Return
          </button>
        </nav>
      </div>
    </div>
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("modal-discard-media") as HTMLElement
  );
}

export default ModalDiscardImage;
