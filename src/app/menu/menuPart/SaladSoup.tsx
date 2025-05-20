import React from "react";
import MenuDetailDrink from "./MenuDetailDrink";
type Props = {};
import menu from "../menu.json";

const SaladSoup = (props: Props) => {
  const salad = menu.salad;
  const soup = menu.soup;

  return (
    <div className="min-h-screen">
      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          SALAD
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        <div className="  text-xl grid grid-cols-3 text-center text-gray-700 font-semibold mb-2">
          <div>{"\u00A0"}</div>

          <div className="">Small</div>
          <div className="">Large</div>
        </div>

        {salad.map((drink, index) => (
          <MenuDetailDrink
            key={index}
            menuItem={{
              name: drink.name,
              description: drink.description,
              priceM: drink.priceM,
              priceL: drink.priceL,
              img: "",
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          SOUP
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        {/* <div className="  text-xl grid grid-cols-3 text-center text-gray-700 font-semibold mb-2">
          <div>{"\u00A0"}</div>

          <div className="">Small</div>
          <div className="">Large</div>
        </div> */}

        {soup.map((drink, index) => (
          <MenuDetailDrink
            key={index}
            menuItem={{
              name: drink.name,
              description: drink.description,
              priceM: drink.priceM,
              priceL: drink.priceL,
              img: "",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SaladSoup;
