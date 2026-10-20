import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import breakfast from "../../../../../public/foodPhotos/breakfast2.jpeg";
import lunch from "../../../../../public/foodPhotos/sandwich.jpeg";
import treats from "../../../../../public/foodPhotos/muffins.jpeg";

const PARTS = [
  {
    time: "Until 11:30",
    title: "Breakfast",
    text: "Skillets, breakfast sandwiches and two-egg plates to start the day right.",
    img: breakfast,
    href: "/menu#breakfast",
  },
  {
    time: "All day",
    title: "Lunch",
    text: "Homemade soup and sandwiches on bread we bake ourselves, with meats roasted in-house.",
    img: lunch,
    href: "/menu#sandwiches",
  },
  {
    time: "Anytime",
    title: "Coffee & treats",
    text: "Lattes, London fogs and a case full of muffins, scones, cinnamon and poppy seed buns.",
    img: treats,
    href: "/menu#coffee-tea",
  },
];

export default function DayParts() {
  return (
    <section className="container-page py-20 md:py-14">
      <div className="flex items-end justify-between gap-6 md:flex-col md:items-start">
        <div>
          <p className="eyebrow">Your day at Brazen Poppy</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-tight lg:text-4xl">
            From first coffee to <em className="italic text-poppy">afternoon tea</em>
          </h2>
        </div>
        <Link href="/menu" className="btn-outline shrink-0">
          Full menu
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 lg:grid-cols-1">
        {PARTS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl lg:flex-row md:flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:w-2/5 md:aspect-[4/3] md:w-full">
              <Image
                src={p.img}
                alt={p.title}
                fill
                placeholder="blur"
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 40vw, 360px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                {p.time}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="flex items-center justify-between font-display text-3xl">
                {p.title}
                <FiArrowUpRight className="h-6 w-6 text-ink-muted transition group-hover:rotate-45 group-hover:text-poppy" />
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
