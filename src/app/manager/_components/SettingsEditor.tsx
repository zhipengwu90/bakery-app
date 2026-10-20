"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/content/types";
import { saveContent } from "./saveContent";
import { Card, Field, Input, SaveBar, Textarea, Toggle, useDraft, useToast } from "./ui";

export default function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const toast = useToast();
  const { draft, setDraft, setSaved, dirty, discard } = useDraft(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, patch: Partial<SiteSettings[K]>) =>
    setDraft({ ...draft, [key]: typeof draft[key] === "object" ? { ...(draft[key] as object), ...patch } : patch });

  const save = async () => {
    const clean: SiteSettings = {
      ...draft,
      about: { ...draft.about, paragraphs: draft.about.paragraphs.map((p) => p.trim()).filter(Boolean) },
    };
    setSaving(true);
    try {
      await saveContent("settings", clean);
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
