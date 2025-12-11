import { createClient } from "../supabase/client";

const getNewItem = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brazen_page")
    .select(`*`)
    .eq("id", 1)
    .eq("type", "newItem");
  if (error) {
    console.error("Error getting item place:", error.message);
    return { success: false, error: error.message };
  } else {
    return { success: true, data };
  }
};

export default getNewItem;
