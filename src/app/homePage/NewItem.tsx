import React, { useState } from "react";
import Image from "next/image";

import croissant from "../../../public/newItems/croissant.jpg";

type Props = {};

const NewItem = (props: Props) => {
  return (
    <div className="bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg">
      {/* Section Header */}
      <div className="flex items-center justify-center w-full ">
        <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
        <div className="px-6 text-center">
          <h2 className="text-xl  font-bold text-red-700 whitespace-nowrap">
            Taste What's New
          </h2>
        </div>
        <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
      </div>

      {/* Main Content */}
      <div className="">
        {/* Content Section */}

        {/* Description */}
        <div className="bg-gradient-to-r my-3 from-green-50 to-orange-50 border-l-4 border-green-500 p-6 rounded-lg space-y-4">
          <p className="text-gray-800 leading-relaxed text-lg ">
            Introducing our Croissant Sandwich — a buttery, flaky delight with a
            touch of sweetness. Freshly baked and perfect with coffee or tea. A
            must-try for pastry lovers!
          </p>
        </div>

        {/* Image Section */}
        <div className="relative order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            <Image
              src={croissant}
              alt="Special New Item"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* New Badge */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              NEW!
            </div>

            {/* Special Offer Badge */}
            {/* <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Limited Time
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItem;
