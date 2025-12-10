import { redirect } from "next/navigation";

import { createClient } from "../utils/supabase/server";
import Context from "./part/Context";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/admin");
  }

  // if (!error || data?.user) {
  //   redirect("/home");
  // }
  return (

    <Context />
  )
}
