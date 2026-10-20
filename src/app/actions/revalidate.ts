"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";

/** Called by the dashboard after a save so the public pages update right away. */
export async function revalidateSite() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { success: false };
  revalidatePath("/", "layout");
  return { success: true };
}
