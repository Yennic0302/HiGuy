"use client";

import "./style.css";

const changeStyleMenu = (e: React.SyntheticEvent) => {
  const children = e.currentTarget.children;
  for (let i = 0; i < children.length; i++) {
    children[i].classList.toggle(`line${i + 1}__menu-btn`);
  }
};

const BtnMenu = () => {
  return (
    <div onClick={changeStyleMenu} className="menu__btn active">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default BtnMenu;
