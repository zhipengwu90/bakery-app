import { FiMapPin, FiNavigation, FiPhone } from "react-icons/fi";
import { fullAddress, mapsEmbedUrl, mapsUrl, telHref } from "@/lib/content/format";
import type { HoursData, SiteSettings } from "@/lib/content/types";
import HoursList from "../HoursList";
import OpenStatus from "../OpenStatus";

export default function Visit({ settings, hours }: { settings: SiteSettings; hours: HoursData }) {
  const { contact } = settings;
  return (
    <section id="visit" className="container-page py-24 md:py-16">
      <div className="grid grid-cols-2 gap-10 lg:grid-cols-1">
        <div>
          <p className="eyebrow">Visit us</p>
          <h2 className="mt-4 font-display text-5xl leading-tight lg:text-4xl">
            Come in, sit down, <em className="italic text-poppy">stay a while.</em>
          </h2>
          <div className="mt-6">
            <OpenStatus hours={hours} />
          </div>

          {hours.specialNote && (
            <p className="mt-6 rounded-2xl border border-poppy/20 bg-poppy-light/50 px-5 py-4 font-medium text-poppy-dark">
              {hours.specialNote}
            </p>
          )}

          <div className="mt-8 rounded-[1.75rem] bg-cream-deep p-4">
            <HoursList hours={hours} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-1">
            <a href={mapsUrl(contact)} target="_blank" rel="noopener noreferrer" className="group flex gap-3 rounded-2xl p-3 transition hover:bg-white">
              <FiMapPin className="mt-1 h-5 w-5 shrink-0 text-poppy" />
              <span>
                <span className="block font-semibold">{contact.addressLine1}</span>
                <span className="block text-ink-muted">{contact.addressLine2}</span>
              </span>
            </a>
            <a href={telHref(contact.phone)} className="group flex gap-3 rounded-2xl p-3 transition hover:bg-white">
              <FiPhone className="mt-1 h-5 w-5 shrink-0 text-poppy" />
              <span>
                <span className="block font-semibold">{contact.phone}</span>
                <span className="block text-ink-muted">Give us a call</span>
              </span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-cream-deep shadow-sm ring-1 ring-ink/5 md:min-h-[340px]">
          <iframe
            title={`Map to Brazen Poppy Bakery, ${fullAddress(contact)}`}
            src={mapsEmbedUrl(contact)}
            className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={mapsUrl(contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary absolute bottom-5 left-5 shadow-lg"
          >
            <FiNavigation /> Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
