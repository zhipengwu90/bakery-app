import { getContent } from "@/lib/content/server";
import type { HoursData, SiteSettings } from "@/lib/content/types";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";

export const revalidate = 300;

const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** schema.org data so Google can show hours, address and phone in search results. */
function bakeryJsonLd(settings: SiteSettings, hours: HoursData) {
  const { contact } = settings;
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    // Matches the Google Business Profile name.
    name: "Brazen Poppy Bakery Restaurant",
    alternateName: "Brazen Poppy Bakery",
    url: "https://brazenpoppy.ca",
    telephone: contact.phone,
    servesCuisine: ["Bakery", "Café", "Breakfast", "Sandwiches"],
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine1,
      addressLocality: "Parksville",
      addressRegion: "BC",
      postalCode: "V9P 1V6",
      addressCountry: "CA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 49.3175, longitude: -124.3139 },
    openingHours: hours.days
      .map((d, i) => (d.open ? `${DAY_CODES[i]} ${d.from}-${d.to}` : null))
      .filter(Boolean),
    sameAs: [contact.facebook, contact.instagram].filter(Boolean),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, hours] = await Promise.all([getContent("settings"), getContent("hours")]);
  const { announcement } = settings;

  return (
    <>
      {announcement.enabled && announcement.text && (
        <div className="bg-poppy px-4 py-2.5 text-center text-sm font-medium text-white">
          {announcement.link ? (
            <a href={announcement.link} className="underline-offset-4 hover:underline">
              {announcement.text} →
            </a>
          ) : (
            announcement.text
          )}
        </div>
      )}
      <SiteHeader contact={settings.contact} />
      <main>{children}</main>
      <SiteFooter settings={settings} hours={hours} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bakeryJsonLd(settings, hours)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
