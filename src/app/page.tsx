import Image from "next/image";
import Hero from "./homePage/Hero";
import FoodPhoto from "./homePage/FoodPhoto";
import NewItem from "./homePage/NewItem";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* <NewItem /> */}
      <FoodPhoto />
    </div>
  );
}
