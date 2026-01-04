import React from "react";
import MenuDetailDrink from "./MenuDetailDrink";
import MenuDetailFeatureDrink from "./MenuDetailFeatureDrink";
type Props = {};
import menu from "../menu.json";

const Drink = (props: Props) => {
  const conffeeTea = menu.coffeeTea;
  const featureDrink = menu.featureDrink;

  return (
    <div className=" ">
      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          COFFEE & TEA
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        <div className="  text-xl grid grid-cols-3 text-center text-gray-700 font-semibold mb-2">
          <div>{"\u00A0"}</div>

          <div className="">12oz</div>
          <div className="">16oz</div>
        </div>

        {conffeeTea &&
          conffeeTea.map((drink, index) => (
            <MenuDetailDrink
              key={index}
              menuItem={{
                name: drink.name,
                description: drink.description,
                priceM: drink.priceM,
                priceL: drink.priceL ? drink.priceL : 0,
                img: "",
              }}
            />
          ))}
      </div>
      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          FEATURE DRINKS
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        <div className="  text-xl grid grid-cols-2 text-center text-gray-700 font-semibold mb-2">
          <div>{"\u00A0"}</div>

          <div className="">One Size</div>
        </div>

        {featureDrink &&
          featureDrink.map((drink, index) => (
            <MenuDetailFeatureDrink
              key={index}
              menuItem={{
                name: drink.name,
                description: drink.description,
                price: drink.price,

                img: "",
              }}
            />
          ))}
      </div>

      <div className="text-xl   sm:text-base  my-6">
        <div className="text-center">Adding creamy cheese foam + $1.5</div>
        <div>
          <span className="font-bold text-red-500"> Milk Options: </span>
          Oat, Soy, Almond, Skim
        </div>
        <div>
          <span className="font-bold text-red-500"> Flavour shots: </span>
          Vanilla, Caramel, Hazelnut, SugarFree Vanilla, Tiramisu, Lavender, Mango, Raspberry,
          Mint, Pumpkin Spice
        </div>

        <div className="mt-3 font-semibold">
          All drinks can be served iced
        </div>
      </div>
    </div>
  );
};

export default Drink;
