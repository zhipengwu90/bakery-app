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

export interface SiteSettings {
  announcement: { enabled: boolean; text: string; link?: string };
  hero: { eyebrow: string; title: string; subtitle: string };
  contact: {
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2: string;
    facebook?: string;
    instagram?: string;
  };
  about: { title: string; intro: string; paragraphs: string[] };
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
