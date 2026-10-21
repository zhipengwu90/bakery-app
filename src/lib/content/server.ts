import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { DEFAULTS } from "./defaults";
import type {
  FeaturedItem,
  GalleryPhoto,
  SiteContentKey,
  SiteContentMap,
  SiteSettings,
} from "./types";

// Cookie-less client: public pages only read public data, so they can be
// statically rendered and revalidated (see `revalidateSite`).
const publicClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

function mergeSettings(data: Partial<SiteSettings>): SiteSettings {
  const d = DEFAULTS.settings;
  return {
    ...d,
    ...data,
    announcement: { ...d.announcement, ...data.announcement },
    hero: { ...d.hero, ...data.hero },
    contact: { ...d.contact, ...data.contact },
    about: { ...d.about, ...data.about },
  };
}

export const getContent = cache(
  async <K extends SiteContentKey>(key: K): Promise<SiteContentMap[K]> => {
    try {
      const { data, error } = await publicClient()
        .from("site_content")
        .select("data")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      if (!data?.data) return DEFAULTS[key];
      if (key === "settings") return mergeSettings(data.data) as SiteContentMap[K];
      return data.data as SiteContentMap[K];
    } catch (err) {
      console.error(`site_content "${key}" unavailable, using defaults:`, err);
      return DEFAULTS[key];
    }
  }
);

/** The "What's new" feature. Pass `includeHidden` from the dashboard. */
export async function getFeatured(includeHidden = false): Promise<FeaturedItem | null> {
  const { data, error } = await publicClient()
    .from("brazen_page")
    .select("id, title, description, img_url, img_filename, is_displayed")
    .eq("id", 1)
    .eq("type", "newItem")
    .maybeSingle();
  if (error || !data) return null;
  const item = { ...data, is_displayed: data.is_displayed ?? true } as FeaturedItem;
  return includeHidden || item.is_displayed ? item : null;
}

export async function getGallery(): Promise<GalleryPhoto[]> {
  const { data, error } = await publicClient()
    .from("brazen_page")
    .select("id, img_url, thumb_url, file_path, img_display_order")
    .eq("type", "foodImg")
    .order("img_display_order", { ascending: false });
  if (error) {
    console.error("Gallery unavailable:", error.message);
    return [];
  }
  return data as GalleryPhoto[];
}
