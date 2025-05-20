import React from "react";
import Image from "next/image";

type Props = {
  // Define any props you want to pass to the component
  // For example, if you want to pass a menu item object:
  menuItem: {
    name: string;
    time?: string;
    description: string;
    price: number;
    img: string;
  };
};

const MenuDetail = (props: Props) => {
  const { menuItem } = props;

  return (
    <div className="">
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-xl  text-gray-800 font-semibold ">
            {menuItem.name}
          </h2>
          {menuItem.time && (
            <p className="text-gray-600 ">
     
              Served until
              <span className="font-bold text-red-500">{menuItem.time }</span>!
            </p>
          )}
          {menuItem.description && (
            <p className="text-gray-600 uppercase">{menuItem.description}</p>
          )}
        </div>
        <div className="text-xl  text-gray-800">
          ${menuItem.price.toFixed(2)}
        </div>
      </div>
      <div className="flex-grow border-t border-gray-300 my-3"></div>
    </div>
  );
};

export default MenuDetail;
