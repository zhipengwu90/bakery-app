"use client";

import { useRef, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import type { DayPart, PhotoSlot, SitePhoto, SiteSettings } from "@/lib/content/types";
import { PHOTO_BUCKET, PhotoField } from "./PhotoField";
import { saveContent } from "./saveContent";
import { Card, Field, Input, SaveBar, Textarea, Toggle, useDraft, useToast } from "./ui";

const DAY_PART_SLOTS: PhotoSlot[] = ["dayPart1", "dayPart2", "dayPart3"];
const FIGURE_SLOTS: PhotoSlot[] = ["storyFigure1", "storyFigure2"];

const photoPaths = (photos: SiteSettings["photos"]) => Object.values(photos).map((p) => p!.path);

/** Delete uploaded files that are no longer used by `keep`. */
async function removeUnusedPhotos(candidates: string[], keep: SiteSettings["photos"]) {
  const used = new Set(photoPaths(keep));
  const stale = candidates.filter((p) => !used.has(p));
  if (stale.length) await createClient().storage.from(PHOTO_BUCKET).remove(stale);
}

export default function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const toast = useToast();
  const { draft, setDraft, saved, setSaved, dirty } = useDraft(initial);
  const [saving, setSaving] = useState(false);
  // Photos uploaded since the last save, so unused ones can be cleaned up.
  const uploaded = useRef<string[]>([]);

  const set = <K extends keyof SiteSettings>(key: K, patch: Partial<SiteSettings[K]>) =>
    setDraft({ ...draft, [key]: typeof draft[key] === "object" ? { ...(draft[key] as object), ...patch } : patch });

  const setPhoto = (slot: PhotoSlot, photo: SitePhoto | undefined) => {
    if (photo) uploaded.current.push(photo.path);
    // Functional update: uploads finish after a delay, and other edits may land meanwhile.
    setDraft((d) => {
      const photos = { ...d.photos };
      if (photo) photos[slot] = photo;
      else delete photos[slot];
      return { ...d, photos };
    });
  };

  const photoField = (slot: PhotoSlot, label: string, aspect: string, maxSize: number, hint?: string) => (
    <PhotoField
      label={label}
      hint={hint}
      slot={slot}
      photo={draft.photos[slot]}
      aspect={aspect}
      maxSize={maxSize}
      onChange={(p) => setPhoto(slot, p)}
    />
  );

  const setDayPart = (i: number, patch: Partial<DayPart>) =>
    setDraft({ ...draft, dayParts: draft.dayParts.map((d, j) => (j === i ? { ...d, ...patch } : d)) });

  const setCaption = (i: number, caption: string) => {
    const captions = [...draft.about.captions];
    captions[i] = caption;
    set("about", { captions });
  };

  const discard = () => {
    removeUnusedPhotos(uploaded.current, saved.photos).catch(console.error);
    uploaded.current = [];
    setDraft(saved);
  };

  const save = async () => {
    const clean: SiteSettings = {
      ...draft,
      about: { ...draft.about, paragraphs: draft.about.paragraphs.map((p) => p.trim()).filter(Boolean) },
    };
    setSaving(true);
    try {
      await saveContent("settings", clean);
      // Replaced photos are no longer on the site, so their files can go.
      removeUnusedPhotos([...photoPaths(saved.photos), ...uploaded.current], clean.photos).catch(console.error);
      uploaded.current = [];
      setDraft(clean);
      setSaved(clean);
      toast("Site text published");
    } catch (e) {
      toast(`Couldn't save: ${(e as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Announcement bar" description="A red strip across the top of every page. Use it for specials, closures or news.">
        <div className="space-y-4">
          <Toggle
            checked={draft.announcement.enabled}
            onChange={(enabled) => set("announcement", { enabled })}
            label={draft.announcement.enabled ? "Showing on the site" : "Hidden"}
          />
          <Field label="Message">
            <Input
              placeholder="e.g. Pumpkin spice lattes are back!"
              value={draft.announcement.text}
              onChange={(e) => set("announcement", { text: e.target.value })}
            />
          </Field>
          <Field label="Link (optional)" hint="Where the bar goes when tapped, e.g. /menu">
            <Input value={draft.announcement.link ?? ""} onChange={(e) => set("announcement", { link: e.target.value })} />
          </Field>
          {draft.announcement.text && (
            <div className="rounded-xl bg-poppy px-4 py-2.5 text-center text-sm font-medium text-white">
              {draft.announcement.text}
              {draft.announcement.link && " →"}
            </div>
          )}
        </div>
      </Card>

      <Card title="Homepage headline" description="The first thing visitors see.">
        <div className="space-y-4">
          <Field label="Small line above the headline">
            <Input value={draft.hero.eyebrow} onChange={(e) => set("hero", { eyebrow: e.target.value })} />
          </Field>
          <Field label="Headline" hint={<>Wrap words in *asterisks* to make them italic and red, e.g. Fresh baked, *every morning.*</>}>
            <Input value={draft.hero.title} onChange={(e) => set("hero", { title: e.target.value })} />
          </Field>
          <Field label="Intro text">
            <Textarea value={draft.hero.subtitle} onChange={(e) => set("hero", { subtitle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-1">
            {photoField("heroMain", "Main photo", "4 / 5", 1200, "Tall photos work best.")}
            {photoField("heroSmall", "Small round photo", "1 / 1", 600)}
          </div>
        </div>
      </Card>

      <Card title="Homepage menu cards" description="The three cards under “From first coffee to afternoon tea”.">
        <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
          {draft.dayParts.slice(0, DAY_PART_SLOTS.length).map((d, i) => (
            <div key={i} className="space-y-4 rounded-xl border border-ink/10 p-4">
              {photoField(DAY_PART_SLOTS[i], "Photo", "4 / 3", 1000)}
              <Field label="Tag on photo" hint="e.g. Until 11:30">
                <Input value={d.label} onChange={(e) => setDayPart(i, { label: e.target.value })} />
              </Field>
              <Field label="Title">
                <Input value={d.title} onChange={(e) => setDayPart(i, { title: e.target.value })} />
              </Field>
              <Field label="Text">
                <Textarea value={d.text} onChange={(e) => setDayPart(i, { text: e.target.value })} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Contact details" description="Used in the header, footer, map and Google search info.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <Field label="Phone">
            <Input value={draft.contact.phone} onChange={(e) => set("contact", { phone: e.target.value })} />
          </Field>
          <Field label="Email (optional)">
            <Input type="email" value={draft.contact.email ?? ""} onChange={(e) => set("contact", { email: e.target.value })} />
          </Field>
          <Field label="Address line 1">
            <Input value={draft.contact.addressLine1} onChange={(e) => set("contact", { addressLine1: e.target.value })} />
          </Field>
          <Field label="Address line 2">
            <Input value={draft.contact.addressLine2} onChange={(e) => set("contact", { addressLine2: e.target.value })} />
          </Field>
          <Field label="Instagram URL">
            <Input value={draft.contact.instagram ?? ""} onChange={(e) => set("contact", { instagram: e.target.value })} />
          </Field>
          <Field label="Facebook URL">
            <Input value={draft.contact.facebook ?? ""} onChange={(e) => set("contact", { facebook: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="“Our Story” page">
        <div className="space-y-4">
          <Field label="Page title">
            <Input value={draft.about.title} onChange={(e) => set("about", { title: e.target.value })} />
          </Field>
          <Field label="Intro (large text)">
            <Textarea value={draft.about.intro} onChange={(e) => set("about", { intro: e.target.value })} />
          </Field>
          <Field label="Story" hint="Leave a blank line between paragraphs.">
            <Textarea
              rows={10}
              value={draft.about.paragraphs.join("\n\n")}
              onChange={(e) => set("about", { paragraphs: e.target.value.split(/\n\s*\n/) })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-1">
            {photoField("storyHeader", "Photo beside the title", "2 / 1", 1200)}
            {photoField("storyWide", "Wide photo", "21 / 9", 2000, "A wide, landscape photo.")}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-4 md:grid-cols-1">
            {FIGURE_SLOTS.map((slot, i) => (
              <div key={slot} className="space-y-3">
                {photoField(slot, `Lower photo ${i + 1}`, "4 / 3", 1200)}
                <Field label="Caption">
                  <Input value={draft.about.captions[i] ?? ""} onChange={(e) => setCaption(i, e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Footer">
        <Field label="Company name in copyright line">
          <Input value={draft.legalName} onChange={(e) => setDraft({ ...draft, legalName: e.target.value })} />
        </Field>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
