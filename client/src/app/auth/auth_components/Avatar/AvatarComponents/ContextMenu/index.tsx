/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from "react";
import "./style.css";

function ContextMenu({
  options,
  coordinates,
  setContextMenu,
}: ContextMenuProperties) {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (e.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        ) {
          contextMenuRef.current.classList.add("close-menu");
          setTimeout(() => {
            setContextMenu(false);
          }, 200);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    callback: () => void
  ) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  };

  return (
    <div
      className={`bg-[var(--input-background)] open-menu rounded-[var(--standard-rounded)] fixed overflow-hidden z-[100] shadow-xl`}
      ref={contextMenuRef}
      style={{
        top: coordinates.y > 500 ? 500 : coordinates.y,
        left: coordinates.x,
      }}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer hover:bg-[var(--background-default-hover)]"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
