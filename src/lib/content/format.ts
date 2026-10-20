import { formatRange } from "./hours";
import type { DayHours, SiteSettings } from "./types";

export const formatPrice = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? "—" : `$${n.toFixed(2)}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const fullAddress = (c: SiteSettings["contact"]) =>
  [c.addressLine1, c.addressLine2].filter(Boolean).join(", ");

export const mapsUrl = (c: SiteSettings["contact"]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(c))}`;

export const mapsEmbedUrl = (c: SiteSettings["contact"]) =>
  `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(c))}&output=embed`;

/** Collapse consecutive days with identical hours: "Mon – Fri  8:00 AM – 4:00 PM". */
export function groupHours(days: DayHours[]) {
  const groups: { label: string; hours: string; note?: string }[] = [];
  let start = 0;
  for (let i = 1; i <= days.length; i++) {
    const a = days[start];
    const b = days[i];
    const same = b && formatRange(a) === formatRange(b) && (a.note ?? "") === (b.note ?? "");
    if (!same) {
      const first = a.day.slice(0, 3);
      const last = days[i - 1].day.slice(0, 3);
      groups.push({
        label: start === i - 1 ? first : `${first} – ${last}`,
        hours: formatRange(a),
        note: a.note,
      });
      start = i;
    }
  }
  return groups;
}

/** Render "*word*" in owner-editable text as an emphasised span. */
export function splitEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2
      ? { em: true, text: part.slice(1, -1) }
      : { em: false, text: part }
  );
}
