"use client";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import getShoppingList from "@/app/utils/sql/getShoppingList";
import { useRouter } from "next/navigation";
import ItemDetail from "../../private/components/ItemDetail";
type Props = {};

const ShoppingListPage = (props: Props) => {
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<any[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shoppingPlace, setShoppingPlace] = useState<string[]>([]);
  const [detailWindow, setDetailWindow] = useState(false);
  const [itemDetail, setItemDetail] = useState<any>(null);

  const getData = async () => {
    const { success, data, error } = await getShoppingList();
    if (success) {
      if (data) {
        setShoppingList(data);

        //find the unique shopping place
        let uniqueShoppingPlaces = new Set<string>();
        data.forEach((item: any) => {
          uniqueShoppingPlaces.add(item.item_list.shopping_place);
        });

        setShoppingPlace(Array.from(uniqueShoppingPlaces));
        setIsLoaded(true);
        console.log(data);
      } else {
        setShoppingList([]);
        setIsLoaded(true);
      }
    } else {
      console.error("Error getting shopping list:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(shoppingList);
  return (
    <div className="flex flex-col gap-3 p-4 ">
      {detailWindow && (
        <ItemDetail
          itemDetail={itemDetail}
          setDetailWindow={setDetailWindow}
          isEditing={false}
        />
      )}
      {!isLoaded ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress color="secondary" />
        </div>
      ) : shoppingList && shoppingList.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold">Shopping List</h2>
          <div className="grid grid-cols-6  text-lg font-semibold">
            <div className="col-span-3 pl-3 ">Item</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-2">Amount</div>
          </div>
          <div className="flex flex-col gap-2">
            {shoppingPlace.map((place) => (
              <div key={place} className="flex flex-col gap-2">
                <div className="text-lg font-semibold ">{place}</div>
                {shoppingList.map(
                  (item: any) =>
                    item.item_list.shopping_place === place && (
                      <div
                        key={item.item_list.id}
                        className=" grid grid-cols-6 pl-3"
                      >
                        <div
                          className="col-span-3 hover:underline hover:cursor-pointer 
                     hover:text-[#ff5151] "
                          onClick={() => {
                            setDetailWindow(true);
                            setItemDetail(item.item_list);
                          }}
                        >
                          {item.item_list.name}
                        </div>
                        <div className="col-span-1">
                          {item.item_list.price
                            ? `$${item.item_list.price}/per`
                            : ""}
                        </div>
                        <div className="col-span-2">{item.amount}</div>
                      </div>
                    )
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/private")}
            >
              Go to Inventory
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">No Shopping List Found</h2>
          <p className="mt-2 text-gray-300">
            It looks like you don't have any items in your shopping list yet.
            Please go to your inventory and generate a list to get started!
          </p>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/private")}
            >
              Go to Inventory
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingListPage;
