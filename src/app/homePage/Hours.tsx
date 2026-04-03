import { WEEKLY_HOURS } from "./hoursData";

const Hours = () => {
  return (
    <div
      id="hours-section"
      className="bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-red-700">Address & Hours</h3>
          <p className="text-gray-600">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shelly+Square,+402,+554+Island+Hwy+E,+Parksville,+BC+V9P+1V6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Shelly Square, 402, 554 Island Hwy E<br />
              Parksville, BC V9P 1V6
            </a>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {WEEKLY_HOURS.map(({ day, hours, open }) => (
          <div
            key={day}
            className={`flex justify-between items-center py-3 px-4 rounded-lg border-l-4 ${
              open
                ? "bg-amber-50 border-green-700"
                : "bg-red-50 border-red-400"
            }`}
          >
            <span className={`font-medium ${open ? "text-gray-700" : "text-red-700"}`}>
              {day}
            </span>
            <span className={`font-medium ${open ? "text-gray-600" : "text-red-500"}`}>
              {hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hours;
