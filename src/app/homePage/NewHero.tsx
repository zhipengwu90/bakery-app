import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";
import bg_coffee from "../../../public/image/bg_coffee.png";
import HourCard from "./HourCard";

const NewHero = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden -mt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bg_coffee}
          alt="Fresh coffee and pastries at Brazen Poppy Bakery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-16 sm:px-4 lg:px-16 py-24 lg:py-24 min-h-screen flex items-center">
        <div className="gap-12 items-center w-full">
          <div className="space-y-10 animate-fade-in">
            {/* Brand Name Section */}
            <div className="space-y-4">
              <div className="flex items-center sm:justify-center mb-6">
                <div className="w-16 h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 mr-4 rounded-full"></div>
                <span className="text-amber-300 text-sm lg:text-base font-medium tracking-[0.3em] uppercase">
                  EST.2018
                </span>
                <div className="w-16 h-[3px] bg-gradient-to-r from-orange-500 to-amber-400 ml-4 rounded-full"></div>
              </div>

              <h1 className="flex flex-col sm:items-center text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                <span className="block text-red-500 font-black text-5xl sm:text-3xl lg:text-7xl xl:text-8xl">
                  Brazen Poppy
                </span>
                <span className="block text-amber-200 text-2xl sm:text-2xl lg:text-4xl xl:text-5xl font-light italic tracking-wide">
                  Bakery
                </span>
              </h1>
            </div>

            {/* Hours Card — hidden on desktop since the full Hours card is visible */}
            <HourCard />

            {/* Main Hero Text */}
            <div className="space-y-6">
              <h2 className="sm:flex sm:flex-row sm:justify-center text-4xl sm:text-xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                <span className="block sm:inline">FRESH</span>
                <span className="hidden sm:inline-block sm:w-4"></span>
                <span className="block sm:inline text-red-500 drop-shadow-lg">
                  BAKED
                </span>
                <span className="hidden sm:inline-block sm:w-4"></span>
                <span className="block sm:inline">DAILY</span>
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed max-w-2xl font-light">
                Join us for breakfast or lunch! Enjoy our{" "}
                <span className="font-bold text-amber-300">outstanding</span>{" "}
                coffee,{" "}
                <span className="font-bold text-amber-300">fresh-baked</span>{" "}
                bread for sandwiches, and{" "}
                <span className="font-bold text-amber-300">oven-fresh</span>{" "}
                pastries.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4 pt-4">
              <Link href="/menu" className="no-underline">
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    border: "2px solid #fbbf24",
                    color: "#fbbf24",
                    fontWeight: "bold",
                    fontSize: "1.125rem",
                    padding: "16px 40px",
                    borderRadius: "12px",
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#fbbf24",
                      color: "#374151",
                      transform: "scale(1.05) translateY(-4px)",
                      border: "2px solid #fbbf24",
                    },
                  }}
                  className="w-fit"
                >
                  VIEW OUR MENU
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-red-500 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
};

export default NewHero;
