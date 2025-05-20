import exp from "constants";
import React from "react";

import MenuDetail from "./MenuDetail";

type Props = {};

const Breakfast = (props: Props) => {
  return (
    <div className="">
      <h1 className="text-4xl font-bold text-red-600 drop-shadow-md">
        Breakfast
      </h1>
      <p className="text-lg text-gray-700 ">
        Served until <span className="font-bold text-red-500">11:30 AM</span>!
      </p>
      <div className="mt-4">
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        <MenuDetail
          menuItem={{
            name: "SKILLET",
            description:
              "Ham, bacon, or sausage with hashbrowns, two eggs, cheese, tomato, green onions",
            price: 16.75,
            img: "",
          }}
        />

        <MenuDetail
          menuItem={{
            name: "TWO EGGS BREAKFAST",
            description:
              "Two eggs, Bacon, ham or sausage, harsh brown or 1pc toast",
            price: 11,
            img: "",
          }}
        />
      </div>
      <div className="text-xl my-6">
        <span className="font-bold text-red-500"> Bread Options: </span>
        multi-grain, whole wheat, white, rye, sourdough, gluten-free bread,
        +$3.00 for croissant
      </div>
    </div>
  );
};

export default Breakfast;
