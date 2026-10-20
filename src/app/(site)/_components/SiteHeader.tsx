"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFacebook, FiInstagram, FiMenu, FiPhone, FiX } from "react-icons/fi";
import logo from "../../../../public/image/BrazenPoppy.png";
import { telHref } from "@/lib/content/format";
import type { SiteSettings } from "@/lib/content/types";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/#visit", label: "Visit" },
];

export default function SiteHeader({ contact }: { contact: SiteSettings["contact"] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          scrolled || open ? "bg-cream/90 shadow-[0_1px_0_rgba(30,25,22,0.08)] backdrop-blur-md" : "bg-cream"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="Brazen Poppy Bakery — home">
            <Image src={logo} alt="Brazen Poppy Bakery" priority className="h-14 w-auto" sizes="80px" />
          </Link>

          <nav className="flex items-center gap-9 lg:hidden" aria-label="Main">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-[15px] font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-poppy after:transition-all after:duration-300 hover:text-poppy ${
                  isActive(l.href) && l.href !== "/#visit"
                    ? "text-ink after:w-full"
                    : "text-ink-soft after:w-0 hover:after:w-full"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="btn-ghost !p-2.5"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
            )}
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="btn-ghost !p-2.5"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
            )}
            <a href={telHref(contact.phone)} className="btn-primary ml-2 !py-2.5">
              <FiPhone className="h-4 w-4" />
              {contact.phone}
            </a>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={telHref(contact.phone)} aria-label={`Call ${contact.phone}`} className="btn-ghost !p-3">
              <FiPhone className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="btn-ghost !p-3"
            >
              {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-20 z-40 hidden overflow-y-auto bg-cream lg:block">
          <nav className="container-page flex flex-col pt-6" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`animate-fade-up border-b border-ink/10 py-5 font-display text-4xl ${
                  isActive(l.href) && l.href !== "/#visit" ? "text-poppy" : "text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-10 flex flex-col gap-3">
              <a href={telHref(contact.phone)} className="btn-primary">
                <FiPhone /> Call {contact.phone}
              </a>
              <div className="flex justify-center gap-2">
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <FiInstagram /> Instagram
                  </a>
                )}
                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <FiFacebook /> Facebook
                  </a>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
