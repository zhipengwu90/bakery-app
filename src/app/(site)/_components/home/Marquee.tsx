import PoppyMark from "../PoppyMark";

const ITEMS = [
  "Poppy seed rolls",
  "Cinnamon buns",
  "Homemade soups",
  "Bread baked in-house",
  "Scones & muffins",
  "Lattes & London fogs",
  "Breakfast skillets",
  "Cookies",
];

export default function Marquee() {
  // Two copies side by side; the track slides by -50% for a seamless loop.
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-ink py-5 text-cream">
      <p className="sr-only">{ITEMS.join(", ")}</p>
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]" aria-hidden="true">
        {track.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-2xl italic md:text-xl">
            <span className="px-8">{item}</span>
            <PoppyMark className="h-5 w-5 text-poppy" />
          </span>
        ))}
      </div>
    </div>
  );
}
