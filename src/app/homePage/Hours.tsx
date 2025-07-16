import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import newCake from "../../../public/newItems/newCake.jpg";
import newYearBg from "../../../public/newItems/newYearBg.png";
import snake from "../../../public/newItems/snake.png";
import new_product from "../../../public/newItems/new_product.jpg";

type Props = {};

const Hours = (props: Props) => {
  return (
    <div
      id="hours-section"
      className="bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-red-700">Address & Hours</h3>
          <p className=" text-gray-600">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shelly+Square,+402,+554+Island+Hwy+E,+Parksville,+BC+V9P+1V6"
              target="_blank"
              rel="noopener noreferrer"
              className=" text-gray-600 hover:text-blue-800 hover:underline 
              transition-colors"
            >
              Shelly Square, 402, 554 Island Hwy E<br />
              Parksville, BC V9P 1V6
            </a>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Monday</span>
          <span className="text-gray-600 font-medium">7 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Tuesday</span>
          <span className="text-gray-600 font-medium">7 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Wednesday</span>
          <span className="text-gray-600 font-medium">7 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Thursday</span>
          <span className="text-gray-600 font-medium">7 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Friday</span>
          <span className="text-gray-600 font-medium">7 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border-l-4 border-green-700">
          <span className="font-medium text-gray-700">Saturday</span>
          <span className="text-gray-600 font-medium">9 a.m. – 3 p.m.</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-lg border-l-4 border-red-400">
          <span className="font-medium text-red-700">Sunday</span>
          <span className="text-red-500 font-medium">Closed</span>
        </div>
      </div>
    </div>
  );
};

export default Hours;
