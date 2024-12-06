import { redirect } from "next/navigation";

import { createClient } from "../utils/supabase/server";
import DataPage from "./shoppingList/data";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="px-2">Hello {data.user.email}</div>

      <DataPage />
    </div>
  );
}
