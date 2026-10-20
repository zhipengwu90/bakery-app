"use client";

import { useState } from "react";
import { formatRange } from "@/lib/content/hours";
import type { HoursData } from "@/lib/content/types";
import { saveContent } from "./saveContent";
import { Card, Input, SaveBar, Textarea, Toggle, inputClass, useDraft, useToast } from "./ui";

export default function HoursEditor({ initial }: { initial: HoursData }) {
  const toast = useToast();
  const { draft, setDraft, setSaved, dirty, discard } = useDraft(initial);
  const [saving, setSaving] = useState(false);

  const setDay = (i: number, patch: Partial<HoursData["days"][number]>) =>
    setDraft({ ...draft, days: draft.days.map((d, j) => (j === i ? { ...d, ...patch } : d)) });

  const copyMondayToWeekdays = () => {
    const { open, from, to } = draft.days[0];
    setDraft({ ...draft, days: draft.days.map((d, i) => (i > 0 && i < 5 ? { ...d, open, from, to } : d)) });
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent("hours", draft);
      setSaved(draft);
      toast("Hours published");
    } catch (e) {
      toast(`Couldn't save: ${(e as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="Special notice"
        description="Shown in a highlighted box next to the hours on the homepage — great for holiday closures. Leave blank to hide."
      >
        <Textarea
          rows={2}
          placeholder="e.g. Closed Dec 25 & 26 — happy holidays!"
          value={draft.specialNote ?? ""}
          onChange={(e) => setDraft({ ...draft, specialNote: e.target.value })}
        />
      </Card>

      <Card
        title="Weekly hours"
        description="The homepage shows “Open now” or “Closed” automatically from these times (Pacific time)."
        actions={
          <button type="button" onClick={copyMondayToWeekdays} className="btn-ghost !px-3 !py-1.5 text-xs">
            Copy Monday to Tue–Fri
          </button>
        }
      >
        <div className="divide-y divide-ink/10">
          {draft.days.map((d, i) => (
            <div key={d.day} className="grid grid-cols-[8rem_7rem_1fr_1fr] items-center gap-3 py-3 lg:grid-cols-2 md:gap-2">
              <span className="font-semibold">{d.day}</span>
              <Toggle checked={d.open} onChange={(open) => setDay(i, { open })} label={d.open ? "Open" : "Closed"} />
              <div className="flex items-center gap-2 lg:col-span-2">
                <input
                  type="time"
                  aria-label={`${d.day} opening time`}
                  value={d.from}
                  disabled={!d.open}
                  onChange={(e) => setDay(i, { from: e.target.value })}
                  className={inputClass}
                />
                <span className="text-ink-muted">to</span>
                <input
                  type="time"
                  aria-label={`${d.day} closing time`}
                  value={d.to}
                  disabled={!d.open}
                  onChange={(e) => setDay(i, { to: e.target.value })}
                  className={inputClass}
                />
              </div>
              <Input
                aria-label={`${d.day} note`}
                placeholder="Note (optional)"
                value={d.note ?? ""}
                onChange={(e) => setDay(i, { note: e.target.value })}
                className="lg:col-span-2"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Preview">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm md:grid-cols-1">
          {draft.days.map((d) => (
            <li key={d.day} className="flex justify-between gap-4">
              <span>{d.day}</span>
              <span className={`tabular-nums ${d.open ? "text-ink-soft" : "text-poppy"}`}>
                {formatRange(d)}
                {d.note && <span className="text-ink-muted"> · {d.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
