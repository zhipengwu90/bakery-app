"use client";
import React, { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import newCake from "../../../public/newItems/newCake.jpg";
import newYearBg from "../../../public/newItems/newYearBg.png";
import snake from "../../../public/newItems/snake.png";

type Props = {};

const NewItem = (props: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="px-32 lg:px-4 my-3">
      <div className="flex flex-row items-center justify-center w-full my-8">
        <div className="flex-grow border-t border-red-500"></div>
        <div className="px-4 text-center text-2xl font-bold text-red-500">
          Taste What’s New
        </div>
        <div className="flex-grow border-t border-red-500"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 ">
        <Image
          src={newCake}
          alt="newYearCake"
          className="rounded-lg shadow-lg h-full"
        />
        <div
          className="relative 
          sm:h-[75vh]
        

        border-2 border-red-400 rounded-lg p-6  shadow-lg"
        >
          <Image
            src={newYearBg}
            alt="newYearBg"
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="relative z-10  text-red-800">
            <p className="font-bold text-md md:text-md  ">
              Celebrate the Lunar New Year with Brazen Poppy’s limited-edition
              6-inch cakes! Available in Sea Salt Oreo and Seasonal Fruit
              flavors for $45, these cakes are perfect for adding sweetness to
              your family gatherings or reunions with friends.
            </p>

            <p className="font-bold ">
              The cake features the Chinese characters “新年快乐” (Happy New
              Year) and a decorative red square with the character “福”
              (Fortune), symbolizing good luck and prosperity for the year
              ahead. Order now and share the joy of a sweet Lunar New Year!
            </p>
            {/* <Image src={snake} alt="snake" className="w-1/2" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItem;
