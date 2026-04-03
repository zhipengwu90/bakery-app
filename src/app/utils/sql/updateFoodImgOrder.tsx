import { createClient } from "../supabase/client";

interface OrderItem {
  id: number;
  img_display_order: number;
}

/**
 * Updates img_display_order for all food images.
 * Uses a two-phase update (temp offset → real values) to avoid unique constraint conflicts.
 */
const updateFoodImgOrder = async (
  items: OrderItem[]
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient();
  const OFFSET = 100000;

  // Phase 1: shift all values out of the 1..N range to avoid collisions
  for (const item of items) {
    const { error } = await supabase
      .from("brazen_page")
      .update({ img_display_order: item.img_display_order + OFFSET })
      .eq("id", item.id);
    if (error) return { success: false, error: error.message };
  }

  // Phase 2: set final values
  for (const item of items) {
    const { error } = await supabase
      .from("brazen_page")
      .update({ img_display_order: item.img_display_order })
      .eq("id", item.id);
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
};

export default updateFoodImgOrder;
