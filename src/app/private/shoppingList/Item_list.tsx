import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
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

// Define an interface for the item
interface Item {
  id: number;
  name: string;
  min_amount: number;
  current_inventory: { total_number: number }[];
  // Add other properties as needed
}

const Item_list = (props: Props) => {
  const { itemList } = props;

  const copyItemList = itemList?.map((item) => ({
    ...item,
    current_inventory: item.current_inventory.map((inv: any) => ({ ...inv })),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [itemDetail, setItemDetail] = useState<any | null>(null);

  const [detailWindow, setDetailWindow] = useState(false);

  const [itemListCopy, setItemListCopy] = useState(copyItemList);

  const [updatedItemList, setUpdatedItemList] = useState([]);
  const [isMinOpen, setIsMinOpen] = useState(false);
  const [currentMinItem, setCurrentMinItem] = useState<Item | null>(null);
  const [isSpecialOpen, setIsSpecialOpen] = useState(false);

  // get all the unique item_category from the itemList
  const itemCategory = itemList?.map((item) => item.item_category);
  const uniqueItemCategory = itemCategory?.filter(
    (item, index) => itemCategory.indexOf(item) === index
  );
  const EditActions = [
    {
      icon: <CloudDoneIcon color="primary" />,
      name: "Submit",
      action: () => {
        handleSubmit(), setIsEditing(false), setActions(menuActions);
      },
    },
    {
      icon: <CancelIcon color="error" />,
      name: "Cancel",
      action: () => {
        confirm(
         "您确定要取消吗？所有未保存的更改将丢失。"
        ) && setIsEditing(false),
          setActions(menuActions);
      },
    },
  ];

  const menuActions = [
    {
      icon: <EditIcon color="success" />,
      name: "Edit",
      action: () => {
        setIsEditing(!isEditing);
        setActions(EditActions);
      },
    },
    { icon: <PlaylistAddIcon color="primary" />, name: "Add-Item" },
    { icon: <FormatListNumberedIcon color="error" />, name: "Shopping-List" },
  ];

  const [actions, setActions] = useState(menuActions);

  // Warn user before refreshing/navigating away while editing
  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && isEditing) {
            const confirmLeave = confirm(
                "您有未保存的更改。您确定要离开此页面吗？"
            );
            if (!confirmLeave) {
                // If the user cancels, bring them back to the page
                window.history.pushState(null, '', window.location.href);
            }
        }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isEditing) {
            e.preventDefault();
            e.returnValue = ""; // This is necessary for some browsers to show the confirmation dialog
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return; // Skip adding the event listeners if not editing

    let startY = 0; // To track the initial touch position
    let hasConfirmed = false; // Flag to track if confirmation has been shown
    const threshold = 50; // Set a threshold for the pull-down distance

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY; // Record the initial Y position of the touch
      hasConfirmed = false; // Reset the flag on touch start
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;

      // Check if the user is pulling down while at the top of the page
      if (
        currentY > startY + threshold &&
        window.scrollY === 0 &&
        !hasConfirmed
      ) {
        // User is pulling down at the top of the page beyond the threshold
        e.preventDefault(); // Stop the pull-to-refresh
        hasConfirmed = true; // Set the flag to true to prevent further confirmations
        const confirmRefresh = confirm(
          "您有未保存的更改。您确定要刷新页面吗？所有更改将丢失。"
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

  const findDifferingMinAmountIds = () => {
    const differingIds: number[] = [];
    const differentObjects: any[] = [];

    itemList?.forEach((item) => {
      const copyItem = itemListCopy?.find((i) => i.id === item.id);

      // console.log(
      //   `Comparing item ID: ${item.id}, min_amount: ${item.min_amount} with copyItem min_amount: ${copyItem?.min_amount}`
      // );
      if (copyItem && item.min_amount !== copyItem.min_amount) {
        differingIds.push(item.id);
        differentObjects.push({ id: item.id, min_amount: copyItem.min_amount });
      }
    });
    return differentObjects;
  };

  const findDifferingTotalNumberIds = () => {
    const differingIds: number[] = [];
    const differentObjects: any[] = [];
    itemList?.forEach((item) => {
      const copyItem = itemListCopy?.find((i) => i.id === item.id);

      if (copyItem) {
        const currentTotalNumber = item.current_inventory[0]?.total_number;
        const copyTotalNumber = copyItem.current_inventory[0]?.total_number;
        // Check if total_number differs
        if (currentTotalNumber != copyTotalNumber) {
          differingIds.push(item.id);

          differentObjects.push({
            id: item.id,
            previous_total_number:
              currentTotalNumber == undefined ? null : currentTotalNumber,
            count_amount: copyTotalNumber,
          });
        }
      }
    });

    return differentObjects;
  };

  const handleSubmit = () => {
    console.log(findDifferingMinAmountIds());
    console.log(findDifferingTotalNumberIds());

    setIsEditing(!isEditing);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => setIsSpecialOpen(false)}
        onOpen={() => setIsSpecialOpen(true)}
        open={isSpecialOpen}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipOpen
            tooltipTitle={action.name}
            onClick={() => {
              action.action && action.action();
              setIsSpecialOpen(false);
            }}
          />
        ))}
      </SpeedDial>

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
        {isMinOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setIsMinOpen(false)}
            ></div>
            <div
              className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-1/3 lg:w-2/3 h-1/4 bg-white z-20 rounded-lg
          
           text-dark flex flex-col justify-center items-center gap-6"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{currentMinItem?.name}</div>
                <p>Min #: </p>
                <div className="flex flex-row justify-center items-center">
                  <IconButton
                    size="medium"
                    sx = {{paddingLeft: 2, paddingRight: 2}}
                    color="primary"
                    onClick={() => {
                      if (currentMinItem && currentMinItem.min_amount <= 0) {
                        console.log(
                          "Min amount is 0 or less, cannot decrement"
                        );
                        return; // Exit if min_amount is 0 or less
                      } else {
                        if (currentMinItem) {
                          currentMinItem.min_amount -= 1;
                          setItemListCopy((prevItemList) =>
                            prevItemList
                              ? prevItemList.map((i) =>
                                  i.id === currentMinItem.id
                                    ? currentMinItem
                                    : i
                                )
                              : []
                          );
                        }
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <div>{currentMinItem?.min_amount}</div>
                  <IconButton
                    size="small"
                    sx = {{paddingLeft: 2, paddingRight: 2}}
                    color="primary"
                    onClick={() => {
                      let currentItem = currentMinItem;
                      if (currentItem) {
                        currentItem.min_amount += 1;
                        setItemListCopy((prevItemList) =>
                          prevItemList
                            ? prevItemList.map((i) =>
                                i.id === currentItem.id ? currentItem : i
                              )
                            : []
                        );
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsMinOpen(false)}
              >
                Done
              </Button>
            </div>
          </>
        )}

        <div className="w-full ">
          <div className="grid  grid-cols-10 place-items-center text-xl font-bold mb-3 sticky top-20">
            <div className="place-self-start col-span-3 pl-1 ">Name</div>
            <div className="col-span-2">Min #</div>
            <div className="col-span-3">Count #</div>
            <div className="col-span-2">Need #</div>
          </div>

          {uniqueItemCategory?.map((category) => (
            <div key={category} className="">
              <div className="flex">
                <div className="text-lg pl-3 text-[#ff5151]">{category}</div>
              </div>
              {itemListCopy
                ?.filter((item) => item.item_category === category)
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-10 py-2 place-items-center"
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
                        <>
                          <div
                            className="col-span-2 hover:underline hover:cursor-pointer py-1 px-2"
                            onClick={() => {
                              setIsMinOpen(!isMinOpen);
                              setCurrentMinItem(item);
                            }}
                          >
                            {item.min_amount}
                          </div>
                        </>
                      )}
                      <div className="col-span-3">
                        {!isEditing ? (
                          <div>{item.current_inventory[0]?.total_number}</div>
                        ) : (
                          <div className="">
                            <IconButton
                              size="small"
                              sx = {{paddingLeft: 1, paddingRight: 2}}
                              color="primary"
                              onClick={() => {
                                let currentItem = item;

                                // Check if current_inventory exists and has at least one item
                                if (
                                  currentItem.current_inventory == null ||
                                  currentItem.current_inventory.length === 0
                                ) {
                                  let newInventory = { total_number: 0 };
                                  currentItem.current_inventory.push(
                                    newInventory
                                  );
                                  setItemListCopy((prevItemList) =>
                                    prevItemList
                                      ? prevItemList.map((i) =>
                                          i.id === currentItem.id
                                            ? currentItem
                                            : i
                                        )
                                      : []
                                  );
                                  return;
                                }
                                // Check if total_number is less than or equal to 0
                                if (
                                  currentItem.current_inventory[0]
                                    .total_number <= 0
                                ) {
                                  console.log(
                                    "Total number is 0 or less, cannot decrement"
                                  );
                                  return; // Exit if total_number is 0 or less
                                }

                                // Decrement total_number
                                currentItem.current_inventory[0].total_number -= 1;

                                // Update the itemListCopy by mapping over the existing items
                                setItemListCopy((prevItemList) =>
                                  prevItemList
                                    ? prevItemList.map((i) =>
                                        i.id === currentItem.id
                                          ? currentItem
                                          : i
                                      )
                                    : []
                                );
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>

                            {item.current_inventory[0]?.total_number == null ||
                            undefined
                              ? "\u00A0"
                              : item.current_inventory[0]?.total_number}
                            <IconButton
                              size="small"
                              sx = {{paddingLeft: 2, paddingRight: 1}}
                              color="primary"
                              onClick={() => {
                                let currentItem = item;

                                // Check if current_inventory exists and has at least one item
                                if (
                                  currentItem.current_inventory == null ||
                                  currentItem.current_inventory.length === 0
                                ) {
                                  let newInventory = { total_number: 0 };
                                  currentItem.current_inventory.push(
                                    newInventory
                                  );
                                  setItemListCopy((prevItemList) =>
                                    prevItemList
                                      ? prevItemList.map((i) =>
                                          i.id === currentItem.id
                                            ? currentItem
                                            : i
                                        )
                                      : []
                                  );
                                  return;
                                }

                                // Decrement total_number
                                currentItem.current_inventory[0].total_number += 1;

                                // Update the itemListCopy by mapping over the existing items
                                setItemListCopy((prevItemList) =>
                                  prevItemList
                                    ? prevItemList.map((i) =>
                                        i.id === currentItem.id
                                          ? currentItem
                                          : i
                                      )
                                    : []
                                );
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        {Math.max(
                          0,
                          (item.min_amount || 0) -
                            (item.current_inventory?.[0]?.total_number || 0)
                        )}
                      </div>
                    </div>
                  );
                })}
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
