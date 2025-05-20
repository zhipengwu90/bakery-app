import React from "react";
import Image from "next/image";

type Props = {
  // Define any props you want to pass to the component
  // For example, if you want to pass a menu item object:
  menuItem: {
    name: string;
    description: string;
    priceM: number;
    priceL: number;
    img: string;
  };
};

const MenuDetailDrink = (props: Props) => {
  const { menuItem } = props;

  return (
    <div className="grid grid-cols-3 items-center gap-2 mb-2 text-xl sm:text-base ">
      {/* Name and Description */}
      <div className="flex flex-col">
        <h2 className="text-base text-gray-800 font-semibold">{menuItem.name}</h2>
        {menuItem.description && (
          <p className="text-gray-600 uppercase">{menuItem.description}</p>
        )}
      </div>
      {/* Prices */}
      <div className="text-center  text-gray-800">
        ${menuItem.priceM.toFixed(2)}
      </div>
      <div className="text-center  text-gray-800">
        {menuItem.priceL? '$'+menuItem.priceL.toFixed(2): 'N/A'}
      </div>
    </div>
  );
};

export default MenuDetailDrink;
