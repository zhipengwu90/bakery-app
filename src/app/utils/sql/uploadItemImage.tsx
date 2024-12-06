import { createClient } from "../supabase/client";

const supabase = createClient();
const uploadItemImage = async (file: File, name: string) => {
  //remove the space and replace with underscore
  let newName = name.replace(/\s/g, "_");

  const fileName = `${newName}_${Date.now()}`;

  const { data, error } = await supabase.storage
    .from("item_photo")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    return { success: false, error: error.message };
  } else {

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("item_photo").getPublicUrl(fileName);

    if (!publicUrl) {
      console.error("Error getting public URL");
      return { success: false, error: "Error getting public URL" };
    }
    console.log("Public URL:", publicUrl);
    return { success: true, url: publicUrl };
  }
};

export default uploadItemImage;
