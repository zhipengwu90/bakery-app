"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiGrid,
  FiImage,
  FiLogOut,
  FiStar,
  FiType,
} from "react-icons/fi";
import logo from "../../../../public/image/BrazenPoppy.webp";
import { createClient } from "@/app/utils/supabase/client";
import { getOpenStatus } from "@/lib/content/hours";
import type { FeaturedItem, GalleryPhoto, HoursData, MenuData, SiteSettings } from "@/lib/content/types";
import FeaturedEditor from "./FeaturedEditor";
import GalleryEditor from "./GalleryEditor";
import HoursEditor from "./HoursEditor";
import MenuEditor from "./MenuEditor";
import SettingsEditor from "./SettingsEditor";
import { ToastProvider } from "./ui";

export interface DashboardData {
  email: string;
  menu: MenuData;
  hours: HoursData;
  settings: SiteSettings;
  featured: FeaturedItem | null;
  gallery: GalleryPhoto[];
}

type TabId = "overview" | "menu" | "hours" | "featured" | "photos" | "settings";

const TABS: { id: TabId; label: string; icon: IconType; description: string }[] = [
  { id: "overview", label: "Overview", icon: FiGrid, description: "" },
  { id: "menu", label: "Menu", icon: FiBookOpen, description: "Add, edit, hide or reorder items and prices." },
  { id: "hours", label: "Hours", icon: FiClock, description: "Weekly opening hours and holiday notices." },
  { id: "featured", label: "What's new", icon: FiStar, description: "The featured item on the homepage." },
  { id: "photos", label: "Photos", icon: FiImage, description: "The food gallery on the homepage." },
  { id: "settings", label: "Site text", icon: FiType, description: "Announcement bar, headline, contact info and story." },
];

function Overview({ data, go }: { data: DashboardData; go: (t: TabId) => void }) {
  const [openLabel, setOpenLabel] = useState("");
  useEffect(() => {
    const s = getOpenStatus(data.hours);
    setOpenLabel(s.state === "open" ? `Open now, until ${s.closesAt}` : s.state === "opens-later" ? `Opens today at ${s.opensAt}` : "Closed right now");
  }, [data.hours]);

  const itemCount = data.menu.sections.reduce((n, s) => n + s.items.filter((i) => !i.hidden).length, 0);
  const cards: { tab: TabId; title: string; value: string; detail: string }[] = [
    { tab: "menu", title: "Menu", value: `${itemCount} items`, detail: `${data.menu.sections.length} sections` },
    { tab: "hours", title: "Hours", value: openLabel || "—", detail: data.hours.specialNote ? `Notice: ${data.hours.specialNote}` : "No special notice" },
    {
      tab: "featured",
      title: "What's new",
      value: data.featured?.title || "Not set",
      detail: data.featured?.is_displayed === false ? "Hidden from homepage" : "Showing on homepage",
    },
    { tab: "photos", title: "Photos", value: `${data.gallery.length} photos`, detail: "In the homepage gallery" },
    {
      tab: "settings",
      title: "Announcement bar",
      value: data.settings.announcement.enabled ? "On" : "Off",
      detail: data.settings.announcement.enabled ? data.settings.announcement.text : "Turn on for specials or closures",
    },
  ];

  return (
    <div>
      <h2 className="font-display text-4xl">Good to see you.</h2>
      <p className="mt-2 text-ink-muted">What would you like to update today? Changes go live on the website as soon as you save.</p>
      <div className="mt-8 grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
        {cards.map((c) => (
          <button
            key={c.title}
            type="button"
            onClick={() => go(c.tab)}
            className="group rounded-2xl border border-ink/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-poppy/40 hover:shadow-md"
          >
            <span className="flex items-center justify-between text-sm font-medium text-ink-muted">
              {c.title}
              <FiChevronRight className="transition group-hover:translate-x-0.5 group-hover:text-poppy" />
            </span>
            <span className="mt-3 block truncate font-display text-2xl">{c.value}</span>
            <span className="mt-1 block truncate text-sm text-ink-muted">{c.detail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as TabId;
    if (TABS.some((t) => t.id === fromHash)) setTab(fromHash);
  }, []);

  const go = (t: TabId) => {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0 });
  };

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-cream lg:flex-col">
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-white px-4 py-6 lg:static lg:h-auto lg:w-full lg:border-b lg:border-r-0 lg:py-3">
          <div className="flex items-center gap-3 px-2 lg:justify-between">
            <div className="flex items-center gap-3">
              <Image src={logo} alt="" className="h-10 w-auto" sizes="60px" />
              <div className="leading-tight">
                <p className="font-semibold">Brazen Poppy</p>
                <p className="text-xs text-ink-muted">Website manager</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="btn-ghost hidden !p-2 lg:inline-flex" aria-label="Log out">
              <FiLogOut />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1 lg:mt-3 lg:flex-row lg:overflow-x-auto" aria-label="Dashboard">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition ${
                  tab === t.id ? "bg-poppy text-white shadow-sm" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <t.icon className="h-[18px] w-[18px]" />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-1 border-t border-ink/10 pt-4 lg:hidden">
            <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-ink/5">
              <FiExternalLink /> View website
            </a>
            <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-ink/5">
              <FiLogOut /> Log out
            </button>
            <p className="truncate px-3 pt-2 text-xs text-ink-muted">{data.email}</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-10 py-10 lg:px-5 lg:py-6">
          <div className="mx-auto max-w-5xl">
            {tab !== "overview" && (
              <header className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl">{current.label}</h1>
                  <p className="mt-1 text-ink-muted">{current.description}</p>
                </div>
                <a href={tab === "menu" ? "/menu" : tab === "settings" ? "/" : "/#visit"} target="_blank" className="btn-outline shrink-0 !py-2 sm:hidden">
                  <FiExternalLink /> View on site
                </a>
              </header>
            )}

            {/* Editors stay mounted so unsaved work survives switching tabs. */}
            <div hidden={tab !== "overview"}>
              <Overview data={data} go={go} />
            </div>
            <div hidden={tab !== "menu"}>
              <MenuEditor initial={data.menu} />
            </div>
            <div hidden={tab !== "hours"}>
              <HoursEditor initial={data.hours} />
            </div>
            <div hidden={tab !== "featured"}>
              <FeaturedEditor initial={data.featured} />
            </div>
            <div hidden={tab !== "photos"}>
              <GalleryEditor initial={data.gallery} />
            </div>
            <div hidden={tab !== "settings"}>
              <SettingsEditor initial={data.settings} />
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
