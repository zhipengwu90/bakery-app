import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
type Props = {
  itemList: any[] | null;
  // itemList: {
  //     id: number;
  //     name: string;
  //     price: number;
  //     item_location: string;
  //     img_url: string;
  //     min_amount: number;
  //     shopping_place: [];
  // } || null;
};

const Item_list = (props: Props) => {
  const { itemList } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [itemDetail, setItemDetail] = useState<any | null>(null);

  const [detailWindow, setDetailWindow] = useState(false);

  const [itemListCopy, setItemListCopy] = useState(itemList);

  // get all the unique item_category from the itemList
  const itemCategory = itemList?.map((item) => item.item_category);
  const uniqueItemCategory = itemCategory?.filter(
    (item, index) => itemCategory.indexOf(item) === index
  );

  // Warn user before refreshing/navigating away while editing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave this page?";
      }
    };

    if (isEditing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return; // Skip adding the event listeners if not editing

    let startY = 0; // To track the initial touch position
    let hasConfirmed = false; // Flag to track if confirmation has been shown

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY; // Record the initial Y position of the touch
      hasConfirmed = false; // Reset the flag on touch start
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;

      // Check if the user is pulling down while at the top of the page
      if (currentY > startY && window.scrollY === 0 && !hasConfirmed) {
        // User is pulling down at the top of the page
        e.preventDefault(); // Stop the pull-to-refresh
        hasConfirmed = true; // Set the flag to true to prevent further confirmations
        const confirmRefresh = confirm(
          "You have unsaved changes. Are you sure you want to refresh the page? All your changes will be lost."
        );
        if (confirmRefresh) {
          window.location.reload(); // Refresh the page if the user confirms
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false, // Allow `preventDefault` in `touchmove`
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isEditing]);

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4 mb-4">
        {isEditing && (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm(
                "Are you sure you want to cancel? All your unsaved changes will be lost."
              ) && setIsEditing(!isEditing);
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {!isEditing ? "Edit" : "Done"}
        </Button>

        {/* <Button variant="contained" color="primary">
          Shopping List
        </Button> */}
      </div>

      <div className="flex flex-row  gap-4 h-full">
        {detailWindow && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setDetailWindow(false)}
            ></div>
            <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-4/5 h-3/4 bg-white  z-10 rounded-lg">
              <div className="flex flex-row items-center justify-end gap-4">
                <IconButton
                  onClick={() => setDetailWindow(!detailWindow)}
                  className="absolute top-0 right-0"
                >
                  <CloseIcon className="text-dark " />
                </IconButton>
              </div>

              <div className="flex flex-col px-3">
                <div className="text-lg text-dark font-bold">
                  {itemDetail?.name}
                </div>
                {itemDetail?.img_url ? (
                  <Image
                    src={itemDetail?.img_url}
                    alt={itemDetail?.name}
                    width={200}
                    height={200}
                  />
                ) : null}
                <div className=" text-dark">{itemDetail?.item_category}</div>
                <div className=" text-dark ">{itemDetail?.item_location}</div>
              </div>
            </div>
          </>
        )}
        <div className="w-full ">
          <div className="grid  grid-cols-9 place-items-center text-xl font-bold mb-3">
            <div className="place-self-start col-span-3 pl-1 ">Name</div>
            <div className="col-span-2">Min #</div>
            <div className="col-span-2">Count #</div>
            <div className="col-span-2">Need #</div>
          </div>

          {uniqueItemCategory?.map((category) => (
            <div key={category} className="">
              <div className="flex">
                <div className="text-lg pl-3 text-[#ff5151]">{category}</div>
              </div>
              {itemList
                ?.filter((item) => item.item_category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-9 py-1 place-items-center"
                  >
                    <div
                      className="col-span-3 place-self-start pl-4 hover:underline hover:cursor-pointer 
                     hover:text-[#ff5151] 
                    "
                      onClick={() => {
                        setDetailWindow(!detailWindow);
                        setItemDetail(item);
                      }}
                    >
                      {item.name}
                    </div>
                    {!isEditing ? (
                      <div className="col-span-2">{item.min_amount}</div>
                    ) : (
                      <div className="col-span-2">{item.min_amount}</div>
                      // <Input
                      //   type="number"
                      //   defaultValue={item.min_amount}
                      //   className="col-span-2 bg-gray-800 text-white w-14 px-1"
                      //   inputProps={{
                      //     style: { backgroundColor: "#2D2D2D", color: "white" },
                      //   }}
                      // />
                    )}
                    <div className="col-span-2">
                      {!isEditing ? (
                        <div className="col-span-2">
                          {item.current_inventory[0]?.current_amount}
                        </div>
                      ) : (
                        <div className="col-span-2">
                          {item.current_inventory[0]?.current_amount}
                        </div>
                        // <Input
                        //   type="number"
                        //   defaultValue={
                        //     item.current_inventory[0]?.current_amount
                        //   }
                        //   className="col-span-2 bg-gray-800 text-white  w-14"
                        //   inputProps={{
                        //     style: {
                        //       backgroundColor: "#2D2D2D",
                        //       color: "white",
                        //     },
                        //   }}
                        // />
                      )}
                    </div>
                    <div className="col-span-2">
                      {Math.max(
                        0,
                        (item.min_amount || 0) -
                          (item.current_inventory?.[0]?.current_amount || 0)
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        {/* 
        <pre className="w-1/4 h-1/2 bg-gray-800 rounded-md p-4">
          {JSON.stringify(itemList, null, 2)}
        </pre> */}
      </div>
    </>
  );
};

export default Item_list;
