"use client";
import React from "react";
import { WEEKLY_HOURS } from "./hoursData";

const HourCard = () => {
  const getTodaysHours = () => {
    const now = new Date();
    const vancouverTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Vancouver" })
    );
    // getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // WEEKLY_HOURS: index 0 = Monday, ..., 6 = Sunday
    const dayIndex = (vancouverTime.getDay() + 6) % 7;
    return {
      ...WEEKLY_HOURS[dayIndex],
      isSunday: dayIndex === 6, // Sunday is index 6 in WEEKLY_HOURS
    };
  };

  const { hours, open, isSunday } = getTodaysHours();

  const handleClick = () => {
    const hoursSection = document.getElementById("hours-section");
    if (hoursSection) {
      const headerHeight = 120;
      const elementPosition = hoursSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
                open ? "bg-green-500" : "bg-red-500"
              } rounded-full mr-3 animate-pulse`}
            ></div>
            <span>{isSunday ? "Afternoon tea only" : "Today's Hours"}</span>
          </div>
          <span className={`font-bold ${open ? "text-amber-300" : "text-red-400"}`}>
            {hours}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HourCard;
