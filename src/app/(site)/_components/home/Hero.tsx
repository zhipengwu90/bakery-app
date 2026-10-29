import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { slotImage } from "@/lib/content/photos";
import type { HoursData, SiteSettings } from "@/lib/content/types";
import Emphasis from "../Emphasis";
import OpenStatus from "../OpenStatus";
import PoppyMark from "../PoppyMark";

function RotatingBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center rounded-full bg-ink text-cream shadow-xl ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text fill="currentColor" fontSize="8" fontWeight="600" letterSpacing="1">
          <textPath href="#badge-circle" textLength="224" lengthAdjust="spacing">
            FRESH BAKED DAILY • PARKSVILLE BC • EST. 2018 •
          </textPath>
        </text>
      </svg>
      <PoppyMark className="h-1/3 w-1/3 text-poppy" />
    </div>
  );
}

export default function Hero({ settings, hours }: { settings: SiteSettings; hours: HoursData }) {
  const { hero, contact, photos } = settings;
  return (
    <section className="relative overflow-hidden">
      {/* soft warm glow behind the photo */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full bg-poppy-light/60 blur-3xl" />

      <div className="container-page relative grid grid-cols-12 items-center gap-12 pb-24 pt-12 lg:grid-cols-1 lg:gap-16 lg:pb-20 lg:pt-6">
        <div className="col-span-7 animate-fade-up lg:col-span-1">
          {/* The eyebrow is part of the H1 so search engines see the town and "bakery" in the headline. */}
          <h1>
            <span className="eyebrow flex items-center gap-2 font-sans leading-normal">
              <PoppyMark className="h-4 w-4 text-poppy" />
              {hero.eyebrow}
            </span>
            <span className="mt-6 block font-display text-[5.25rem] font-medium leading-[0.95] tracking-tight xl:text-7xl md:text-[3.25rem]">
              <Emphasis text={hero.title} />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-base">{hero.subtitle}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-primary !px-7 !py-3.5 !text-base">
              See the menu <FiArrowRight />
            </Link>
            <Link href="/#visit" className="btn-outline !px-7 !py-3.5 !text-base">
              Plan your visit
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <OpenStatus hours={hours} />
            <span className="flex items-center gap-2">
              <FiMapPin className="text-poppy" />
              {contact.addressLine1}
            </span>
          </div>
        </div>

        <div className="relative col-span-5 mx-auto w-full max-w-md animate-fade-up [animation-delay:150ms] lg:col-span-1 md:max-w-xs">
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-full shadow-2xl shadow-ink/20">
            <Image
              {...slotImage(photos, "heroMain")}
              fill
              priority
              sizes="(max-width: 1023px) 80vw, 420px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-10 h-40 w-40 overflow-hidden rounded-full border-[6px] border-cream shadow-xl xl:-left-4 md:h-28 md:w-28">
            <Image {...slotImage(photos, "heroSmall")} fill sizes="160px" className="object-cover" />
          </div>
          <RotatingBadge className="absolute -right-6 -top-2 h-32 w-32 md:-right-2 md:h-24 md:w-24" />
        </div>
      </div>
    </section>
  );
}
