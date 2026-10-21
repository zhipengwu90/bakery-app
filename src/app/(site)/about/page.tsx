import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GiCoffeeCup, GiSlicedBread, GiWheat } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";
import sign from "../../../../public/image/brazenPoppyImage.webp";
import warm from "../../../../public/image/warm.webp";
import muffins from "../../../../public/foodPhotos/muffins.webp";
import cookies from "../../../../public/foodPhotos/cookies2.webp";
import { getContent } from "@/lib/content/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Brazen Poppy is a bakery café in Shelly Square, Parksville. Our bakers start early every day so the bread, soups and pastries are fresh when you arrive.",
};

const PILLARS = [
  {
    icon: GiSlicedBread,
    title: "Baked on site",
    text: "Bread for every sandwich, plus muffins, scones, turnovers, cookies and our signature poppy seed rolls.",
  },
  {
    icon: GiWheat,
    title: "Gluten-free friendly",
    text: "Most of our soups are gluten-free, and any sandwich can be made on gluten-free bread.",
  },
  {
    icon: GiCoffeeCup,
    title: "A place to linger",
    text: "Comfortable seating and a modern space — a great spot to meet friends for coffee, breakfast or lunch.",
  },
];

export default async function AboutPage() {
  const { about } = await getContent("settings");

  return (
    <>
      <section className="container-page grid grid-cols-2 items-center gap-14 pb-16 pt-10 lg:grid-cols-1">
        <div className="animate-fade-up">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-5 font-display text-6xl leading-[1.02] tracking-tight md:text-5xl">{about.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-soft">{about.intro}</p>
        </div>
        <div className="relative aspect-[2/1] overflow-hidden rounded-[2rem] shadow-xl">
          <Image src={sign} alt="The Brazen Poppy Bakery sign in the shop window" fill priority placeholder="blur" sizes="(max-width: 1023px) 92vw, 540px" className="object-cover" />
        </div>
      </section>

      <section className="container-page">
        <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem] md:aspect-[4/3]">
          <Image src={warm} alt="Inside the café: the coffee bar, chalkboard menu and a seasonal display" fill placeholder="blur" sizes="(max-width: 1200px) 100vw, 1150px" className="object-cover" />
        </div>
      </section>

      <section className="container-page grid grid-cols-12 gap-10 py-20 lg:grid-cols-1 md:py-14">
        <div className="col-span-4 lg:col-span-1">
          <h2 className="font-display text-4xl leading-tight">
            Nothing but <em className="italic text-poppy">fresh</em> for our customers.
          </h2>
        </div>
        <div className="col-span-8 space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-1">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-cream-deep py-20 md:py-14">
        <div className="container-page grid grid-cols-3 gap-6 lg:grid-cols-1">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[1.75rem] bg-cream p-8">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-poppy-light text-poppy">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-2xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid grid-cols-2 gap-6 py-20 md:grid-cols-1 md:py-14">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Image src={muffins} alt="A tray of fresh muffins" fill placeholder="blur" sizes="(max-width: 767px) 92vw, 560px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-ink-muted">
            Handcrafted pastries, baked in our own kitchen with ingredients from local suppliers.
          </figcaption>
        </figure>
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Image src={cookies} alt="Freshly baked cookies" fill placeholder="blur" sizes="(max-width: 767px) 92vw, 560px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-ink-muted">
            Old-fashioned techniques, made to make your taste-buds happy.
          </figcaption>
        </figure>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-[2rem] bg-poppy px-10 py-14 text-center text-white md:px-6">
          <h2 className="font-display text-5xl md:text-4xl">Come say hello.</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Find us in the Shelly Square building on the Island Highway in Parksville.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/#visit" className="btn bg-white text-poppy hover:bg-cream">
              Hours & directions <FiArrowRight />
            </Link>
            <Link href="/menu" className="btn border border-white/40 text-white hover:bg-white/10">
              See the menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
