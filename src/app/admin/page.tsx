import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import LoginPage from "./loginPart/Login";

// Already signed in → skip the form and go straight to the dashboard.
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) redirect("/manager");

  return <LoginPage />;
}
