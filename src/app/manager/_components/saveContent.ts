import { revalidateSite } from "@/app/actions/revalidate";
import { createClient } from "@/app/utils/supabase/client";
import type { SiteContentKey, SiteContentMap } from "@/lib/content/types";

/** Persist one block of site content and refresh the public pages. */
export async function saveContent<K extends SiteContentKey>(key: K, data: SiteContentMap[K]) {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  await revalidateSite();
}
