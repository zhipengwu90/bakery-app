import Image from "next/image";
import { createClient } from "../utils/supabase/server";

interface NewItemData {
  id: number;
  title: string;
  description: string;
  img_url: string;
  type: string;
}

const NewItem = async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brazen_page")
    .select("*")
    .eq("id", 1)
    .eq("type", "newItem")
    .single();

  const newItemData = data as NewItemData | null;

  return (
    <div className="bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg">
      {/* Section Header */}
      <div className="flex items-center justify-center w-full">
        <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
        <div className="px-6 text-center">
          <h2 className="text-xl font-bold text-red-700 whitespace-nowrap">
            {newItemData?.title ?? ""}
          </h2>
        </div>
        <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
      </div>

      {/* Main Content */}
      <div>
        {/* Description */}
        <div className="bg-gradient-to-r my-3 from-green-50 to-orange-50 border-l-4 border-green-500 p-6 rounded-lg space-y-4">
          <p className="text-gray-800 leading-relaxed text-md">
            {newItemData?.description ?? ""}
          </p>
        </div>

        {/* Image Section */}
        <div className="relative order-2 lg:order-1">
          {newItemData?.img_url ? (
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <Image
                src={newItemData.img_url}
                width={600}
                height={400}
                alt="Special New Item"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                NEW!
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewItem;
