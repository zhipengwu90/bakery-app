"use client";

import { useEffect, useState } from "react";
import { formatRange, shopNow } from "@/lib/content/hours";
import type { HoursData } from "@/lib/content/types";

export default function HoursList({ hours }: { hours: HoursData }) {
  const [today, setToday] = useState(-1);
  useEffect(() => setToday(shopNow().dayIndex), []);

  return (
    <ul className="divide-y divide-ink/10">
      {hours.days.map((d, i) => {
        const isToday = i === today;
        return (
          <li
            key={d.day}
            className={`flex items-baseline justify-between gap-4 px-3 py-3 ${
              isToday ? "rounded-xl bg-white font-semibold shadow-sm" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              {d.day}
              {isToday && (
                <span className="rounded-full bg-poppy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Today
                </span>
              )}
            </span>
            <span className="text-right">
              <span className={`tabular-nums ${d.open ? "" : "text-poppy-deep"}`}>{formatRange(d)}</span>
              {d.note && <span className="block text-xs font-normal italic text-ink-muted">{d.note}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
