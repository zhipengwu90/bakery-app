import type { Metadata } from "next";
import { FiPhone } from "react-icons/fi";
import { formatPrice, telHref } from "@/lib/content/format";
import { getContent } from "@/lib/content/server";
import type { MenuSection } from "@/lib/content/types";
import PoppyMark from "../_components/PoppyMark";
import MenuNav from "./MenuNav";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Breakfast skillets, sandwiches on bread baked in-house, homemade soups, salads, coffee and feature drinks at Brazen Poppy Bakery in Parksville, BC.",
};

function Section({ section }: { section: MenuSection }) {
  const items = section.items.filter((i) => !i.hidden);
  const sized = section.sizes.length > 0;

  return (
    // scroll-mt adds the pill bar's height on top of the header offset already set on <html>.
    <section id={section.id} className="mb-16 break-inside-avoid scroll-mt-16">
      <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
        <div>
          <h2 className="font-display text-[2.1rem] leading-tight">{section.title}</h2>
          {section.subtitle && <p className="mt-1 text-sm italic text-ink-muted">{section.subtitle}</p>}
        </div>
        {sized && (
          <div className="flex shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {section.sizes.map((s) => (
              <span key={s} className="w-16 text-right">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <ul className="mt-2">
        {items.map((item) => (
          <li key={item.id} className="py-3.5">
            <div className="flex items-baseline">
              <span className="text-[17px] font-semibold">{item.name}</span>
              {sized ? (
                <>
                  <span className="leader" />
                  {section.sizes.map((_, k) => (
                    <span key={k} className="w-16 text-right tabular-nums text-ink-soft">
                      {formatPrice(item.prices[k])}
                    </span>
                  ))}
                </>
              ) : (
                <>
                  <span className="leader" />
                  <span className="font-display text-lg tabular-nums">{formatPrice(item.prices[0])}</span>
                </>
              )}
            </div>
            {item.description && (
              <p className="mt-1 max-w-[85%] text-[15px] leading-relaxed text-ink-muted">{item.description}</p>
            )}
          </li>
        ))}
      </ul>

      {section.notes.length > 0 && (
        <div className="mt-4 space-y-1.5 rounded-2xl bg-cream-deep px-5 py-4 text-sm leading-relaxed text-ink-soft">
          {section.notes.map((n) => (
            <p key={n} className="flex gap-2">
              <PoppyMark className="mt-[3px] h-3.5 w-3.5 shrink-0 text-poppy" />
              {n}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getContent("menu"), getContent("settings")]);
  const sections = menu.sections.filter((s) => s.items.some((i) => !i.hidden));

  return (
    <>
      <header className="container-page pb-12 pt-10 text-center">
        <p className="eyebrow">Made in-house, every day</p>
        <h1 className="mt-4 font-display text-7xl tracking-tight md:text-5xl">Our Menu</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Bread, soups and pastries are made from scratch in our kitchen. Ask us about gluten-free options — most soups
          are, and any sandwich can be.
        </p>
      </header>

      <MenuNav sections={sections.map(({ id, title }) => ({ id, title }))} />

      <div className="container-page py-16">
        <div className="columns-2 gap-16 lg:columns-1">
          {sections.map((s) => (
            <Section key={s.id} section={s} />
          ))}
        </div>
      </div>

      <div className="container-page pb-24">
        <div className="flex items-center justify-between gap-6 rounded-[2rem] bg-ink px-10 py-10 text-cream md:flex-col md:px-6 md:text-center">
          <div>
            <h2 className="font-display text-3xl">Allergies or special requests?</h2>
            <p className="mt-2 text-cream/70">Just ask — we&apos;re happy to help you find something that works.</p>
          </div>
          <a href={telHref(settings.contact.phone)} className="btn-primary shrink-0">
            <FiPhone /> {settings.contact.phone}
          </a>
        </div>
      </div>
    </>
  );
}
