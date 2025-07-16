"use client";
import React from "react";

type Props = {};

const HourCard = (props: Props) => {
  const getTodaysHours = () => {
    // Get current time in Vancouver timezone
    const now = new Date();
    const vancouverTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Vancouver" })
    );
    const dayOfWeek = vancouverTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Determine hours based on day of week
    if (dayOfWeek === 0) {
      // Sunday
      return {
        hours: "Closed",
        isOpen: false,
      };
    } else if (dayOfWeek === 6) {
      // Saturday
      return {
        hours: "9:00 AM - 3:00 PM",
        isOpen: true,
      };
    } else {
      // Monday to Friday (1-5)
      return {
        hours: "7:00 AM - 3:00 PM",
        isOpen: true,
      };
    }
  };

  const { hours, isOpen } = getTodaysHours();

  const handleClick = () => {
    const hoursSection = document.getElementById("hours-section");
    if (hoursSection) {
      const headerHeight = 80; // Adjust based on your header height
      const elementPosition = hoursSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20 max-w-md cursor-pointer hover:from-white/25 hover:to-white/10 transition-all duration-300 transform hover:scale-105"
      onClick={handleClick}
    >
      <div className="space-y-3 text-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 ${
                isOpen ? "bg-green-500" : "bg-red-500"
              } rounded-full mr-3 animate-pulse`}
            ></div>
            <span>Today's Hours</span>
          </div>
          <span
            className={`font-bold ${
              isOpen ? "text-amber-300" : "text-red-400"
            }`}
          >
            {hours}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HourCard;
