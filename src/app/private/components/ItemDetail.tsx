import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IconButton, Button, Alert } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import getIemCategory from "../../utils/sql/getItemCategory";
import getShoppingPlace from "../../utils/sql/getShoppingPlace";
import uploadItemImage from "../../utils/sql/uploadItemImage";

type Props = {
  itemDetail: any;
  setDetailWindow: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
};

const ItemDetail = (props: Props) => {
  const { itemDetail, setDetailWindow, isEditing } = props;
  const [isEditDetail, setIsEditDetail] = useState(false);
  const [itemCategory, setItemCategory] = useState<any | null>(null);


  const [itemCategoryValue, setItemCategoryValue] = useState(
    itemDetail?.item_category || ""
  );
  const [shoppingPlace, setShoppingPlace] = useState<any | null>(null);
  const [shoppingPlaceValue, setShoppingPlaceValue] = useState(
    itemDetail?.shopping_place || ""
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await uploadItemImage(file, itemDetail?.name);
      console.log("Upload image result:", result);
    }
  };

  const getItemCategoryHandler = async () => {
    try {
      const { data, error } = await getIemCategory();

      if (error) {
        throw new Error(error);
      }
      setItemCategory(data);
    } catch (error) {
      console.error("Error getting item category:", error);
    }
  };

  const getShoppingPlaceHandler = async () => {
    try {
      const { data, error } = await getShoppingPlace();

      if (error) {
        throw new Error(error);
      }
      setShoppingPlace(data);
    } catch (error) {
      console.error("Error getting shopping place:", error);
    }
  };

  useEffect(() => {
    getItemCategoryHandler();
    getShoppingPlaceHandler();
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-10"
        onClick={() => setDetailWindow(false)}
      ></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-4/5 h-3/4 bg-white  z-10 rounded-lg shadow-md  overflow-y-auto">
        <div className="flex flex-row items-center p-1 justify-between sticky top-0 bg-white border-b border-gray-300">
          <IconButton
            onClick={() => setDetailWindow(false)}
            className="absolute top-0 right-0"
          >
            <CloseIcon className="text-dark " />
          </IconButton>
          <h1 className="text-dark  text-lg font-bold">
            Item ID:{itemDetail?.id}
          </h1>
        </div>

        <div className="grid grid-cols-10 text-dark px-3 pt-2 pb-7 gap-y-2">
          {isEditing && (
            <Alert
              className="col-span-10 flex justify-center items-center"
              severity="error"
            >
              You can't edit the item details while in the inventory edit mode.
            </Alert>
          )}
          <div className="col-span-4 lg:col-span-5 font-semibold">Name:</div>
          {isEditDetail ? (
            <input
              type="text"
              className="col-span-6 lg:col-span-5 border border-gray-300 rounded-sm px-1"
              defaultValue={itemDetail?.name}
            />
          ) : (
            <div className="col-span-6  lg:col-span-5 ">{itemDetail?.name}</div>
          )}
          <div className="col-span-4 lg:col-span-5 font-semibold">Price:</div>
          {isEditDetail ? (
            <input
              type="number"
              min="0"
              className="col-span-6 lg:col-span-5 border border-gray-300 rounded-sm px-1"
              defaultValue={itemDetail?.price}
            />
          ) : (
            <div className="col-span-6 lg:col-span-5 ">{itemDetail?.price}</div>
          )}

          <div className="col-span-4 lg:col-span-5 font-semibold">
            Category:
          </div>

          {isEditDetail ? (
            <select
              className="col-span-6 lg:col-span-5 border border-gray-300 rounded-sm px-1"
              onChange={(e) => setItemCategoryValue(e.target.value)}
              value={itemCategoryValue}
            >
              {itemCategory?.map((item: any, index: number) => (
                <option key={index} value={item.enum_value}>
                  {item.enum_value}
                </option>
              ))}
            </select>
          ) : (
            <div className="col-span-6  lg:col-span-5 ">
              {itemDetail?.item_category}
            </div>
          )}

          <div className="col-span-4 lg:col-span-5 font-semibold">
            Shopping Place:
          </div>

          {isEditDetail ? (
            <select
              className="col-span-6 lg:col-span-5 border border-gray-300 rounded-sm px-1"
              onChange={(e) => setShoppingPlaceValue(e.target.value)}
              value={shoppingPlaceValue}
            >
              {shoppingPlace?.map((item: any, index: number) => (
                <option key={index} value={item.enum_value}>
                  {item.enum_value}
                </option>
              ))}
            </select>
          ) : (
            <div className="col-span-6 lg:col-span-5 ">
              {itemDetail?.shopping_place}
            </div>
          )}

          <div className="col-span-4 font-semibold">Location:</div>
          <div className="col-span-6 ">{itemDetail?.item_location}</div>
          <div className="col-span-10 font-semibold">Comment:</div>

          {isEditDetail ? (
            <textarea
              className="col-span-10 border border-gray-300 rounded-sm pl-3"
              defaultValue={itemDetail?.comment}
            />
          ) : (
            <div className="col-span-10 pl-3 ">{itemDetail?.comment}</div>
          )}
          <div className="col-span-10 font-semibold">Image:</div>
          <div className="col-span-10 flex justify-center items-center">
            {itemDetail?.img_url ? (
              isEditDetail ? (
                <div className="flex flex-col justify-center items-center gap-3 border border-gray-300 p-3">
                  <Image
                    src={itemDetail?.img_url}
                    alt={itemDetail?.name}
                    width={200}
                    height={200}
                  />
                  <Button variant="contained" color="error">
                    Delete Image
                  </Button>
                  <Button variant="contained" color="success">
                    Upload New Image
                  </Button>
                </div>
              ) : (
                <Image
                  src={itemDetail?.img_url}
                  alt={itemDetail?.name}
                  width={200}
                  height={200}
                />
              )
            ) : isEditDetail ? (
              <div className="flex flex-col justify-center items-center gap-3 border border-gray-300 p-3">
                <div className="w-40 h-40 bg-gray-300 flex justify-center items-center">
                  No Image
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <Button variant="contained" color="success" onClick={handleUploadClick}>
                  Upload Image
                </Button>
              </div>
            ) : (
              <div className="w-40 h-40 bg-gray-300 flex justify-center items-center">
                no image
              </div>
            )}
          </div>

          <div className="col-span-10 flex flex-col justify-center items-center my-5 gap-3">
            <div>
              {isEditDetail ? (
                <div className="flex gap-3">
                  <Button
                    className="w-24"
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditDetail(false)}
                  >
                    Save
                  </Button>
                  <Button
                    className="w-24"
                    variant="contained"
                    color="error"
                    onClick={() => setIsEditDetail(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-24"
                  variant="contained"
                  color="primary"
                  disabled={isEditing}
                  onClick={() => setIsEditDetail(true)}
                >
                  Edit
                </Button>
              )}

              {/* <Button
                className="w-24"
                variant="contained"
                color="error"
                disabled={isEditing}
              >
                Delete
              </Button> */}
            </div>
            <IconButton size="large" color="error" disabled={isEditing}>
              <DeleteForeverIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
