import Image from "next/image";
import Hero from "./homePage/Hero";
import FoodPhoto from "./homePage/FoodPhoto";
import NewItem from "./homePage/NewItem";
import NewHero from "./homePage/NewHero";
import Hours from "./homePage/Hours";
export default function Home() {
  return (
    <div>
      {/* <Hero /> */}

      <NewHero />

      <div className="px-32 lg:px-4 my-8 grid grid-cols-2 gap-4 md:grid-cols-1">
        <NewItem />
        <Hours />
      </div>

      <FoodPhoto />
    </div>
  );
}
