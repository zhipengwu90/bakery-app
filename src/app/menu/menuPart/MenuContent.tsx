"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import menu2 from "../../../../public/menu/menu1.png";
import menu from "../../../../public/menu/menu1.jpg";
import breakfast from "../../../../public/foodPhotos/breakfast.jpeg";
import emblaCarousel from "embla-carousel";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuDetail from "./MenuDetail";
import AllDay from "./AllDay";
import Breakfast from "./Breakfast";
import Drink from "./Drink";
import MenuItem from "./MenuItem";
import SaladSoup from "./SaladSoup";
type Props = {};

const MenuContent = (props: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const menuItems = ["ALL-DAY", "BREAKFAST", "DRINKS"];
  // const emblaRef = useRef(null);
  // useEffect(() => {
  //   if (emblaRef.current) {
  //     const embla = emblaCarousel(emblaRef.current, { loop: true });
  //     return () => embla.destroy();
  //   }
  // }, []);

  useEffect(() => {
    window.scrollTo({
      top: 20,
      behavior: "smooth", // Smooth scrolling
    });
  }, [selectedIndex]);

  // const openModal = (imageSrc: string) => {
  //   setSelectedImage(imageSrc);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedImage(null);
  // };

  return (
    <div className="px-32 lg:px-4 my-3">
      <div className="flex flex-row items-center justify-center w-full my-8 sticky top-20 bg-white z-10  bg-opacity-90 pb-3">
        <div className="flex-grow border-t border-red-500"></div>

        <MenuItem
          label="PLATES"
          isSelected={selectedIndex === 0}
          onClick={() => setSelectedIndex(0)}
        />
        <MenuItem
          label="SALAD/SOUP"
          isSelected={selectedIndex === 1}
          onClick={() => setSelectedIndex(1)}
        />
        <MenuItem
          label="DRINKS"
          isSelected={selectedIndex === 2}
          onClick={() => setSelectedIndex(2)}
        />
        <div className="flex-grow border-t border-red-500"></div>
      </div>

      {/* <p className="text-lg text-gray-700 mb-6 text-center font-semibold">
        Breakfast Skillets, Breakfast Sandwiches, Daily Soups, Sandwiches Made
        to Order, Hamburgers, Gluten Free Options
      </p> */}
      <div className=" ">
        {selectedIndex === 0 && <AllDay />}
        {selectedIndex === 1 && <SaladSoup />}
        {selectedIndex === 2 && <Drink />}
      </div>

      {/* <MenuDetail /> */}
      {/* 
      <section className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            <div className="embla__slide" onClick={() => openModal(menu2.src)}>
              <div className="embla__slide__number">
                <Image
                  src={menu2}
                  alt="menu"
                  layout="responsive"
                  objectFit="contain"
                  width={100}
                  height={100}
                  className="shadow-lg max-h-[70vh] cursor-pointer"
                />
              </div>
            </div>
            <div
              className="embla__slide flex justify-center items-center"
              onClick={() => openModal(menu.src)}
            >
              <div className="embla__slide__number flex-1">
                <Image
                  src={menu}
                  alt="menu"
                  layout="responsive"
                  width={100}
                  height={100}
                  objectFit="contain"
                  className="shadow-lg max-h-[70vh] cursor-pointer"
                />
              </div>
            </div>
            <div
              className="embla__slide"
              onClick={() => openModal(breakfast.src)}
            >
              <div className="embla__slide__number">
                <Image
                  src={breakfast}
                  alt="breakfast"
                  layout="responsive"
                  objectFit="contain"
                  width={100}
                  height={100}
                  className="shadow-lg max-h-[70vh] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            outline: "none",
            overflow: "auto",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[900],
            }}
          >
            <div className="bg-white opacity-70 rounded-full p-1">
              <CloseIcon  
                fontSize="large"
        
              />
            </div>
          </IconButton>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected"
              layout="responsive"
              width={800}
              height={600}
              objectFit="contain"
              className="rounded-lg"
            />
          )}
        </Box>
      </Modal> */}
    </div>
  );
};

export default MenuContent;
