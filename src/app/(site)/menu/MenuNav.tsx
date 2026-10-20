"use client";

import { useEffect, useRef, useState } from "react";

type Section = { id: string; title: string };

// A section is "current" once its top passes this line (px from the top of
// the viewport), just below the sticky header + pill bar.
const ACTIVE_LINE = 200;

/** Sticky category pills that follow the section currently in view. */
export default function MenuNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  // After a click, keep the clicked pill highlighted until the user scrolls
  // themselves: in the two-column layout sections sit side by side, so scroll
  // position alone can't tell which one was picked.
  const locked = useRef(false);

  useEffect(() => {
    const update = () => {
      if (locked.current) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setActive(sections[sections.length - 1]?.id);
      // Of the sections whose top has passed the line, take the one that
      // passed most recently (closest to the line).
      let best: { id: string; top: number } | null = null;
      for (const s of sections) {
        const top = document.getElementById(s.id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= ACTIVE_LINE && (!best || top > best.top)) best = { id: s.id, top };
      }
      setActive(best?.id ?? sections[0]?.id);
    };
    const unlock = () => (locked.current = false);
    const userEvents = ["wheel", "touchstart", "keydown"];

    update();
    window.addEventListener("scroll", update, { passive: true });
    userEvents.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => {
      window.removeEventListener("scroll", update);
      userEvents.forEach((e) => window.removeEventListener(e, unlock));
    };
  }, [sections]);

  // Centre the active pill by scrolling only the bar sideways. (scrollIntoView
  // would also touch the page and cancel the smooth jump to the section.)
  useEffect(() => {
    const bar = barRef.current;
    const pill = pillRefs.current[active ?? ""];
    if (!bar || !pill || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-20 z-30 border-y border-ink/10 bg-cream/90 backdrop-blur-md"
    >
      <div
        ref={barRef}
        className="container-page relative flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            ref={(el) => {
              pillRefs.current[s.id] = el;
            }}
            href={`#${s.id}`}
            onClick={() => {
              locked.current = true;
              setActive(s.id);
            }}
            aria-current={active === s.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              active === s.id ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
