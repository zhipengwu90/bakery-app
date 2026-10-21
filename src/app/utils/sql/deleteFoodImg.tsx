import { createClient } from "../supabase/client";

const deleteFoodImg = async (id: number, filePath: string | null): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createClient();

    if (filePath) {
      // Gallery photos and their thumbnails live in the "foodPhoto" bucket (see uploadFoodImg).
      const { error: storageError } = await supabase.storage
        .from("foodPhoto")
        .remove([filePath, `${filePath}_thumb`]);
      if (storageError) throw storageError;
    }

    const { error: dbError } = await supabase
      .from("brazen_page")
      .delete()
      .eq("id", id);
    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
};

export default deleteFoodImg;
