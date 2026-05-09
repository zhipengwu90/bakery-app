export interface DayHours {
  day: string;
  hours: string;
  open: boolean;
}

export const WEEKLY_HOURS: DayHours[] = [
  { day: "Monday", hours: "8:00 AM – 4:00 PM", open: true },
  { day: "Tuesday", hours: "8:00 AM – 4:00 PM", open: true },
  { day: "Wednesday", hours: "8:00 AM – 4:00 PM", open: true },
  { day: "Thursday", hours: "8:00 AM – 4:00 PM", open: true },
  { day: "Friday", hours: "8:00 AM – 4:00 PM", open: true },
  { day: "Saturday", hours: "9:00 AM – 4:00 PM", open: true },
  { day: "Sunday (Afternoon tea only)", hours: "11:00 AM – 4:00 PM", open: true },
];
