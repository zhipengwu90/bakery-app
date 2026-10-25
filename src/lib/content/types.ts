// Shapes of the editable site content stored in the Supabase `site_content`
// table (one row per key, JSON in `data`).

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** One price per size; a single entry when the section has no sizes. */
  prices: (number | null)[];
  hidden?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  subtitle?: string;
  /** Column labels such as ["12 oz", "16 oz"]. Empty = one price. */
  sizes: string[];
  items: MenuItem[];
  /** Small print shown under the section (bread options, milk options…). */
  notes: string[];
}

export interface MenuData {
  sections: MenuSection[];
}

export interface DayHours {
  day: string;
  open: boolean;
  /** 24h "HH:MM" */
  from: string;
  /** 24h "HH:MM" */
  to: string;
  note?: string;
}

export interface HoursData {
  days: DayHours[]; // Monday … Sunday
  /** e.g. "Closed Dec 25 & 26 — happy holidays!" */
  specialNote?: string;
}

/** A photo uploaded from the dashboard to the `brazen_page` storage bucket. */
export interface SitePhoto {
  url: string;
  path: string;
}

/** Fixed photo spots on the public pages; each falls back to a built-in photo. */
export type PhotoSlot =
  | "heroMain"
  | "heroSmall"
  | "dayPart1"
  | "dayPart2"
  | "dayPart3"
  | "storyHeader"
  | "storyWide"
  | "storyFigure1"
  | "storyFigure2";

/** One of the three homepage cards (Breakfast / Lunch / Coffee & treats). */
export interface DayPart {
  /** Small tag on the photo, e.g. "Until 11:30". */
  label: string;
  title: string;
  text: string;
  href: string;
}

export interface SiteSettings {
  announcement: { enabled: boolean; text: string; link?: string };
  hero: { eyebrow: string; title: string; subtitle: string };
  dayParts: DayPart[];
  /** Uploaded replacements for the built-in photos. */
  photos: Partial<Record<PhotoSlot, SitePhoto>>;
  contact: {
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2: string;
    facebook?: string;
    instagram?: string;
  };
  about: {
    title: string;
    intro: string;
    paragraphs: string[];
    /** Captions under the two photos near the bottom of the page. */
    captions: string[];
  };
  legalName: string;
}

export interface SiteContentMap {
  menu: MenuData;
  hours: HoursData;
  settings: SiteSettings;
}

export type SiteContentKey = keyof SiteContentMap;

export interface FeaturedItem {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  img_filename: string | null;
  is_displayed: boolean;
}

export interface GalleryPhoto {
  id: number;
  img_url: string;
  /** Small copy for the grid; null for photos uploaded before thumbnails existed. */
  thumb_url: string | null;
  file_path: string | null;
  img_display_order: number;
}
