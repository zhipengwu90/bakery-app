"use client";
import React, { useEffect, useState } from "react";
import getHistory from "@/app/utils/sql/getHistory";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
type Props = {};

const HistoryPage = (props: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<any>([]);

  const router = useRouter();

  const getData = async () => {
    setIsLoaded(true);
    const result = await getHistory();
    if (result.success) {
      setHistory(result.data);
      console.log("result", result.data);
      setIsLoaded(true);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">
        Shopping History
      </h1>
      {isLoaded ? (
        <div>
          <div className="grid grid-cols-4">
            <div className=" col-span-1">Shopping Date</div>
            <div className=" col-span-1">Shopping Place</div>
            <div className=" col-span-1">Total Cost</div>
            <div className=" col-span-1">Receipt</div>
          </div>

          {history.length > 0 ? (
            history.map((item: any) => {
              ///get the mm/dd/yyyy from the created_at
              const date = new Date(item.created_at);
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const year = date.getFullYear();
              const formattedDate = month + "/" + day + "/" + year;

              return (
                <div key={item.id}>
                  <div className="grid grid-cols-4">
                    <div className=" col-span-1">{formattedDate}</div>
                    <div className=" col-span-1">{item.shopping_place}</div>
                    <div className=" col-span-1">{item.total_cost}</div>
                    <div className=" col-span-1">{item.receipt_img}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center text-lg text-red-600 font-bold h-[80vh]">
              No shopping history found
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className="flex justify-center items-center gap-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/private")}
        >
          Go to Inventory
        </Button>
      </div>
    </div>
  );
};

export default HistoryPage;
