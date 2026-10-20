import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { FeaturedItem } from "@/lib/content/types";

export default function Featured({ item }: { item: FeaturedItem }) {
  return (
    <section className="container-page py-24 md:py-16">
      <div className="grid grid-cols-2 items-center gap-14 rounded-[2rem] bg-cream-deep p-6 lg:gap-8 md:grid-cols-1 md:p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink/5">
          {item.img_url && (
            <Image
              src={item.img_url}
              alt={item.title}
              fill
              sizes="(max-width: 767px) 92vw, 560px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          )}
          <span className="absolute left-5 top-5 grid h-20 w-20 -rotate-12 place-items-center rounded-full bg-poppy text-center font-display text-lg font-semibold leading-none text-white shadow-lg">
            New!
          </span>
        </div>

        <div className="pr-8 md:p-2 md:pb-4">
          <p className="eyebrow">Just out of the oven</p>
          <h2 className="mt-4 font-display text-5xl leading-tight lg:text-4xl">{item.title}</h2>
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-ink-soft">{item.description}</p>
          <Link href="/menu" className="btn-outline mt-8">
            Browse the full menu <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
