import React from "react";

type MenuItemProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ label, isSelected, onClick }) => {
  return (
    <h1
      className={`px-4 text-center text-2xl sm:text-base font-semibold text-red-500 cursor-pointer transition-transform duration-300 ${
        isSelected ? "underline underline-offset-4 scale-110 font-bold " : "hover:scale-105"
      }`}
      onClick={onClick}
    >
      {label}
    </h1>
  );
};

export default MenuItem;