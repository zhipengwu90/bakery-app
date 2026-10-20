"use client";

import { useEffect, useRef, useState } from "react";

/** Sticky category pills that follow the section currently in view. */
export default function MenuNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const pillRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    pillRefs.current[active ?? ""]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-20 z-30 border-y border-ink/10 bg-cream/90 backdrop-blur-md"
    >
      <div className="container-page flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <a
            key={s.id}
            ref={(el) => {
              pillRefs.current[s.id] = el;
            }}
            href={`#${s.id}`}
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
