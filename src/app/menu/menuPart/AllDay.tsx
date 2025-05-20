import React, { useState } from "react";
import MenuDetail from "./MenuDetail";
import menu from "../menu.json";
import Plates from "../../../../public/menu/Plates.png";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
type Props = {};

const AllDay = (props: Props) => {
  const Sandwiches = menu.sandwiches;
  const Others = menu.others;
  const Breakfast = menu.breakfast;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      {/* <h1 className="text-4xl font-bold text-red-600 drop-shadow-md">
        Dayfare
      </h1> */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
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
              <CloseIcon fontSize="large" />
            </div>
          </IconButton>
          <Image
            src={Plates}
            alt="menu"
            layout="responsive"
            objectFit="contain"
            className="shadow-lg max-h-[70vh] "
          />
        </Box>
      </Modal>

      <div
        onClick={openModal}
        className="flex flex-col cursor-pointer items-center justify-center w-full my-8"
      >
        <Image
          src={Plates}
          alt="menu"
          layout=""
          objectFit="contain"
          width={100}
          height={100}
          className="shadow-lg max-h-[70vh] "
        />
        <p className="text-lg text-gray-700">Browse our visual menu here.</p>
      </div>

      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          BREAKFAST
        </h1>
        {/* Served until <span className="font-bold text-red-500">11:30 AM</span>! */}
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>
        {Breakfast &&
          Breakfast.map((item, index) => (
            <MenuDetail
              key={index}
              menuItem={{
                name: item.name,
                time: item.time,
                description: item.description,
                price: item.price,
                img: item.img,
              }}
            />
          ))}
      </div>

      <div className="mt-4">
        <h1 className="text-3xl text-green-700 font-bold drop-shadow-lg mt-10">
          SANDWICHES
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>

        {Sandwiches &&
          Sandwiches.map((item, index) => (
            <MenuDetail
              key={index}
              menuItem={{
                name: item.name,
                description: item.description,
                price: item.price,
                img: item.img,
              }}
            />
          ))}
      </div>
      <div className="mt-4">
        <h1 className="text-3xl text-green-700  font-bold drop-shadow-lg mt-10">
          OTHERS
        </h1>
        <div className="flex-grow border-t border-gray-300 mt-4 mb-3"></div>

        {Others.map((item, index) => (
          <MenuDetail
            key={index}
            menuItem={{
              name: item.name,
              description: item.description,
              price: item.price,
              img: item.img,
            }}
          />
        ))}
      </div>

      <div className="text-xl my-6">
        <span className="font-bold text-red-500"> Bread Options: </span>
        multi-grain, whole wheat, white, rye, sourdough, gluten-free bread,
        +$3.00 for croissant
      </div>
    </div>
  );
};

export default AllDay;
