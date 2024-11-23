"use client";
import React from "react";
import { createClient } from "../../utils/supabase/client";
import { useEffect, useState } from "react";
type Props = {};

const DataPage = (props: Props) => {
  const [notes, setNotes] = useState<any[] | null>(null);
  const [notes2, setNotes2] = useState<any[] | null>(null);
  const [notes3, setNotes3] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("inventory_list").select();

      const data2 = await supabase.from("current_inventory").select();
      const data3 = await supabase.from("shopping_list").select();
      setNotes(data);
      setNotes2(data2.data);
        setNotes3(data3.data);

    };
    getData();
  }, []);
  return (
    <div>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
      <pre>{JSON.stringify(notes2, null, 2)}</pre>
        <pre>{JSON.stringify(notes3, null, 2)}</pre>
    </div>
  );
};

export default DataPage;
