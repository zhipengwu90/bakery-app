import FoodPhoto from "./homePage/FoodPhoto";
import NewItem from "./homePage/NewItem";
import NewHero from "./homePage/NewHero";
import Hours from "./homePage/Hours";

export default function Home() {
  return (
    <div>
      <NewHero />

      <div className="px-32 lg:px-4">
        <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-1">
          <NewItem />
          <Hours />
        </div>

        <FoodPhoto />
      </div>
    </div>
  );
}
