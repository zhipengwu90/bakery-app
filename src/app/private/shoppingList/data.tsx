"use client";
import React from "react";
import { createClient } from "../../utils/supabase/client";
import { useEffect, useState } from "react";
import Item_list from "./Item_list";
type Props = {};

const DataPage = (props: Props) => {
  const [itemList, setItemList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("item_list").select(
        `*,
         current_inventory (
        date,
        count_amount,
        shopped_amount,
        current_amount,
        used_amount
        
        )
        `
      )
      .order("date", { foreignTable: "current_inventory", ascending: false })
      .limit(1, { foreignTable: "current_inventory" });

      console.log(error);
      setItemList(data);
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <div className="w-full">
      {loading ? <div>Loading...</div> : <Item_list itemList={itemList} />}
    </div>
  );
};

export default DataPage;
