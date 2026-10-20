"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/content/hours";
import type { HoursData } from "@/lib/content/types";

// Rendered on the client only: pages are statically generated, so the server
// can't know the visitor's "now".
export default function OpenStatus({
  hours,
  tone = "light",
}: {
  hours: HoursData;
  tone?: "light" | "dark";
}) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(hours));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  const base =
    tone === "light"
      ? "border-ink/10 bg-white/70 text-ink"
      : "border-white/15 bg-white/10 text-cream";

  if (!status) {
    return <span className={`inline-flex h-9 w-56 rounded-full border ${base} opacity-0`} />;
  }

  const [dot, label] =
    status.state === "open"
      ? ["bg-leaf", `Open now · until ${status.closesAt}`]
      : status.state === "opens-later"
        ? ["bg-crust", `Opens today at ${status.opensAt}`]
        : ["bg-poppy", status.next ? `Closed · opens ${status.next.day} at ${status.next.opensAt}` : "Closed"];

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium ${base}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {status.state === "open" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
      </span>
      {label}
    </span>
  );
}
