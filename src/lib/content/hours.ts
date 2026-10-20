import type { DayHours, HoursData } from "./types";

export const TIME_ZONE = "America/Vancouver";

/** "08:00" → "8:00 AM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

export function formatRange(d: DayHours): string {
  return d.open ? `${formatTime(d.from)} – ${formatTime(d.to)}` : "Closed";
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** Index into HoursData.days (0 = Monday) and minutes since midnight, in shop time. */
export function shopNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return {
    dayIndex: Math.max(0, weekdays.indexOf(get("weekday"))),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export type OpenStatus =
  | { state: "open"; closesAt: string; today: DayHours }
  | { state: "opens-later"; opensAt: string; today: DayHours }
  | { state: "closed"; next?: { day: string; opensAt: string } };

export function getOpenStatus(hours: HoursData, now = new Date()): OpenStatus {
  const { dayIndex, minutes } = shopNow(now);
  const today = hours.days[dayIndex];

  if (today?.open) {
    if (minutes >= toMinutes(today.from) && minutes < toMinutes(today.to)) {
      return { state: "open", closesAt: formatTime(today.to), today };
    }
    if (minutes < toMinutes(today.from)) {
      return { state: "opens-later", opensAt: formatTime(today.from), today };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const d = hours.days[(dayIndex + i) % 7];
    if (d?.open) {
      return {
        state: "closed",
        next: { day: i === 1 ? "tomorrow" : d.day, opensAt: formatTime(d.from) },
      };
    }
  }
  return { state: "closed" };
}
