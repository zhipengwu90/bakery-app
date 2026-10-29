import type { StaticImageData } from "next/image";
import breakfast from "../../../public/foodPhotos/breakfast2.webp";
import coffee from "../../../public/foodPhotos/coffee.webp";
import cookies from "../../../public/foodPhotos/cookies2.webp";
import muffins from "../../../public/foodPhotos/muffins.webp";
import bun from "../../../public/foodPhotos/poppyseedBun.webp";
import lunch from "../../../public/foodPhotos/sandwich.webp";
import sign from "../../../public/image/brazenPoppyImage.webp";
import warm from "../../../public/image/warm.webp";
import type { PhotoSlot, SiteSettings } from "./types";

/** Built-in photo for each spot, shown until a replacement is uploaded. */
export const DEFAULT_PHOTOS: Record<PhotoSlot, { img: StaticImageData; alt: string }> = {
  heroMain: { img: bun, alt: "Poppy seed buns with cream cheese icing, fresh from the oven" },
  heroSmall: { img: coffee, alt: "A latte with foam art" },
  dayPart1: { img: breakfast, alt: "Breakfast at Brazen Poppy Bakery in Parksville" },
  dayPart2: { img: lunch, alt: "A sandwich on bread baked in-house at Brazen Poppy Bakery" },
  dayPart3: { img: muffins, alt: "Fresh muffins and coffee treats at Brazen Poppy Bakery" },
  storyHeader: { img: sign, alt: "The Brazen Poppy Bakery sign in the shop window" },
  storyWide: { img: warm, alt: "Inside the café: the coffee bar, chalkboard menu and a seasonal display" },
  storyFigure1: { img: muffins, alt: "A tray of fresh muffins" },
  storyFigure2: { img: cookies, alt: "Freshly baked cookies" },
};

/** Alt text for an uploaded photo when the page has no caption for it. */
const UPLOADED_ALT: Record<PhotoSlot, string> = {
  heroMain: "Fresh baking at Brazen Poppy Bakery in Parksville, BC",
  heroSmall: "Coffee at Brazen Poppy Bakery café in Parksville",
  dayPart1: "Breakfast at Brazen Poppy Bakery in Parksville",
  dayPart2: "Lunch at Brazen Poppy Bakery in Parksville",
  dayPart3: "Coffee and treats at Brazen Poppy Bakery",
  storyHeader: "Brazen Poppy Bakery in Parksville, BC",
  storyWide: "Inside the Brazen Poppy Bakery café",
  storyFigure1: "Fresh baking at Brazen Poppy Bakery",
  storyFigure2: "Fresh baking at Brazen Poppy Bakery",
};

/**
 * `next/image` props for a photo spot: the uploaded photo if there is one,
 * otherwise the built-in photo. `alt` describes an uploaded photo (falls back
 * to a generic description of the spot, since we can't know what it shows).
 */
export function slotImage(photos: SiteSettings["photos"], slot: PhotoSlot, alt = "") {
  const custom = photos[slot];
  if (custom) return { src: custom.url, alt: alt || UPLOADED_ALT[slot], placeholder: "empty" as const };
  const fallback = DEFAULT_PHOTOS[slot];
  return { src: fallback.img, alt: fallback.alt, placeholder: "blur" as const };
}
