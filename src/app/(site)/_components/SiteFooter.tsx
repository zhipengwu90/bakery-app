import Image from "next/image";
import Link from "next/link";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import logo from "../../../../public/image/BrazenPoppy.webp";
import { groupHours, mapsUrl, telHref } from "@/lib/content/format";
import type { HoursData, SiteSettings } from "@/lib/content/types";

export default function SiteFooter({ settings, hours }: { settings: SiteSettings; hours: HoursData }) {
  const { contact } = settings;
  return (
    <footer className="bg-ink text-cream">
      <div className="container-page grid grid-cols-4 gap-10 py-16 lg:grid-cols-2 sm:grid-cols-1">
        <div>
          <Image src={logo} alt="Brazen Poppy Bakery" className="h-20 w-auto" sizes="120px" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            A neighbourhood bakery café in Parksville, baking from scratch every morning since 2018.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">Find us</h3>
          <a href={mapsUrl(contact)} target="_blank" rel="noopener noreferrer" className="mt-4 block leading-relaxed hover:text-poppy-light">
            {contact.addressLine1}
            <br />
            {contact.addressLine2}
          </a>
          <a href={mapsUrl(contact)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-poppy-light underline-offset-4 hover:underline">
            Get directions →
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">Hours</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {groupHours(hours.days).map((g) => (
              <li key={g.label} className="flex justify-between gap-4">
                <span className="text-cream/70">{g.label}</span>
                <span className="text-right tabular-nums">
                  {g.hours}
                  {g.note && <span className="block text-xs italic text-cream/50">{g.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">Say hello</h3>
          <a href={telHref(contact.phone)} className="mt-4 block font-display text-2xl hover:text-poppy-light">
            {contact.phone}
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="mt-1 block text-sm text-cream/70 hover:text-cream">
              {contact.email}
            </a>
          )}
          <div className="mt-5 flex gap-3">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition hover:border-poppy hover:bg-poppy">
                <FiInstagram />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition hover:border-poppy hover:bg-poppy">
                <FiFacebook />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex items-center justify-between gap-4 py-6 text-xs text-cream/50 md:flex-col md:text-center">
          <p>
            © {new Date().getFullYear()} Brazen Poppy Bakery · {settings.legalName}
          </p>
          <Link href="/admin" className="hover:text-cream">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
