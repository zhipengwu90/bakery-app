import React, { useEffect, useState } from "react";
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

  // get all the unique item_category from the itemList
  const itemCategory = itemList?.map((item) => item.item_category);
  const uniqueItemCategory = itemCategory?.filter(
    (item, index) => itemCategory.indexOf(item) === index
  );

  console.log(itemDetail);

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

      <div className="flex flex-row  gap-4">
        {detailWindow && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setDetailWindow(false)}
            ></div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-4/5 h-3/4 bg-white  z-10 rounded-lg">
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
                      <Input
                        type="number"
                        defaultValue={item.min_amount}
                        className="col-span-2 bg-gray-800 text-white w-14 px-1"
                        inputProps={{
                          style: { backgroundColor: "#2D2D2D", color: "white" },
                        }}
                      />
                    )}
                    <div className="col-span-2">
                      {!isEditing ? (
                        <div className="col-span-2">
                          {item.current_inventory[0]?.current_amount}
                        </div>
                      ) : (
                        <Input
                          type="number"
                          defaultValue={
                            item.current_inventory[0]?.current_amount
                          }
                          className="col-span-2 bg-gray-800 text-white  w-14"
                          inputProps={{
                            style: {
                              backgroundColor: "#2D2D2D",
                              color: "white",
                            },
                          }}
                        />
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
