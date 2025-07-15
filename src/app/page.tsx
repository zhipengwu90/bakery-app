import Image from "next/image";
import Hero from "./homePage/Hero";
import FoodPhoto from "./homePage/FoodPhoto";
import NewItem from "./homePage/NewItem";
import NewHero from "./homePage/NewHero";
export default function Home() {
  return (
    <div>
      {/* <Hero /> */}
      {/* <NewItem /> */}
      <NewHero />
      {/* Hours Info */}
      {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-bold text-white mb-3">Today's Hours</h3>
        <div className="space-y-1 text-gray-200">
          <div className="flex justify-between">
            <span>Monday - Friday</span>
            <span className="font-semibold">7:00 AM - 3:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Saturday - Sunday</span>
            <span className="font-semibold">8:00 AM - 2:00 PM</span>
          </div>
        </div>
      </div> */}


      <FoodPhoto />
    </div>
  );
}
