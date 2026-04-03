import { createClient } from "../supabase/client";

const getFoodImg = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brazen_page")
    .select("id, img_url, img_display_order")
    .eq("type", "foodImg")
    .order("img_display_order", { ascending: false });
  if (error) {
    console.error("Error getting item place:", error.message);
    return { success: false, error: error.message };
  } else {
    return { success: true, data };
  }
};

export default getFoodImg;
