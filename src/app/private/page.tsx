import { redirect } from "next/navigation";

import { createClient } from "../utils/supabase/server";
import DataPage from "./shoppingList/data";
import { Button } from "@mui/material";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div>Hello {data.user.email}</div>

      <DataPage />
    </div>
  );
}
