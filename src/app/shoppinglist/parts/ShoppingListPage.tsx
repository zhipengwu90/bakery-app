"use client";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import getShoppingList from "@/app/utils/sql/getShoppingList";
import { useRouter } from "next/navigation";
type Props = {};

const ShoppingListPage = (props: Props) => {
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<any[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getData = async () => {
    const { success, data, error } = await getShoppingList();
    if (success) {
      if (data) {
        setShoppingList(data);
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
  return (
    <div className="flex flex-col gap-3 p-4 ">
      {!isLoaded ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress color="secondary" />
        </div>
      ) : shoppingList && shoppingList.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold">Shopping List</h2>
          <div className="flex flex-col gap-2">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                className="flex flex-row justify-between items-center"
              >
                <div className="flex flex-row justify-center items-center gap-1">
                  <div className="text-lg font-semibold">
                    {item.item_list.name}
                  </div>
                  <div className="text-lg text-gray-300">{item.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/private")}
          >
            Go to Inventory
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">No Shopping List Found</h2>
          <p className="mt-2 text-gray-300">
            It looks like you don't have any items in your shopping list yet.
            Please go to your inventory and generate a list to get started!
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/private")}
          >
            Go to Inventory
          </Button>
        </>
      )}
    </div>
  );
};

export default ShoppingListPage;
