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
    return { success: true, data };
  }
};

export default uploadItemImage;
