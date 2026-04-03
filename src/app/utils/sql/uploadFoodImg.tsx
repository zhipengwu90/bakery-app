import imageCompression from "browser-image-compression";
import { createClient } from "../supabase/client";

interface UploadResponse {
  success: boolean;
  error?: string;
  data?: {
    publicUrl: string;
    fileName: string;
  };
}

const uploadFoodImg = async (
  file: File | null,
  imgDisplayOrder: number = 0,
): Promise<UploadResponse> => {
  try {
    // Validate inputs

    const supabase = await createClient();

    let publicUrl: string | null = null;
    let fileName: string | null = null;

    // Handle image upload if file provided
    if (file) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "File must be an image" };
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return { success: false, error: "Image size must be less than 10MB" };
      }

      try {
        // Compress image
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        fileName = `food_${Date.now()}`;

        // Upload compressed image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("foodPhoto")
          .upload(fileName, compressedFile);

        if (uploadError) {
          console.error("Storage upload error:", uploadError.message);
          return {
            success: false,
            error: `Upload failed: ${uploadError.message}`,
          };
        }

        if (!uploadData) {
          return { success: false, error: "Upload returned no data" };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("foodPhoto")
          .getPublicUrl(fileName);

        publicUrl = urlData?.publicUrl;

        if (!publicUrl) {
          return { success: false, error: "Failed to get public URL" };
        }
      } catch (compressionError) {
        console.error("Image compression error:", compressionError);
        return {
          success: false,
          error: "Image compression failed",
        };
      }
    }

    // Update database
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
      img_display_order: imgDisplayOrder,
    };

    // Only update image fields if a new image was uploaded
    if (publicUrl && fileName) {
      updatePayload.img_url = publicUrl;
      updatePayload.file_path = fileName;
      updatePayload.img_filename = fileName;
    }

    // const { data: updateData, error: updateError } = await supabase
    //   .from("brazen_page")
    //   .update(updatePayload)
    //   .eq("type", "foodImg")
    //   .eq("id", 1)
    //   .select();

    const { data: upload, error: uploadError } = await supabase
      .from("brazen_page")
      .insert({
        type: "foodImg",
        ...updatePayload,
      })
      .select();

    if (uploadError) {
      console.error("Database update error:", uploadError.message);
      return {
        success: false,
        error: `Database upload failed: ${uploadError.message}`,
      };
    }

    if (!upload || upload.length === 0) {
      return {
        success: false,
        error: "No records updated. Please check if the item exists.",
      };
    }

    return {
      success: true,
      data: {
        publicUrl: publicUrl || "",
        fileName: fileName || "",
      },
    };
  } catch (error) {
    console.error("Unexpected error in uploadFoodImg:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default uploadFoodImg;
