"use client";

import { useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import type { MenuData, MenuItem, MenuSection } from "@/lib/content/types";
import { saveContent } from "./saveContent";
import { Field, IconButton, Input, SaveBar, Textarea, inputClass, useDraft, useToast } from "./ui";

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

const priceCount = (s: MenuSection) => Math.max(1, s.sizes.length);

function PriceInput({ value, onChange, label }: { value: number | null; onChange: (v: number | null) => void; label: string }) {
  return (
    <div className="relative w-24 shrink-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">$</span>
      <input
        type="number"
        inputMode="decimal"
        step="0.05"
        min="0"
        aria-label={label}
        placeholder="—"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className={`${inputClass} !pl-6 !pr-2 tabular-nums`}
      />
    </div>
  );
}

function ItemRow({ item, section, index, count, onChange, onMove, onRemove }: {
  item: MenuItem;
  section: MenuSection;
  index: number;
  count: number;
  onChange: (i: MenuItem) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const sizes = section.sizes.length ? section.sizes : ["Price"];
  return (
    <div className={`flex gap-3 rounded-xl border border-ink/10 p-3 md:flex-col ${item.hidden ? "bg-ink/[0.03] opacity-60" : "bg-white"}`}>
      <div className="flex-1 space-y-2">
        <input
          aria-label="Item name"
          placeholder="Item name"
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          className={`${inputClass} font-semibold`}
        />
        <input
          aria-label="Description"
          placeholder="Description (optional)"
          value={item.description ?? ""}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          className={`${inputClass} !py-2 text-sm`}
        />
      </div>
      <div className="flex items-start gap-2 md:justify-between">
        <div className="flex gap-2">
          {sizes.map((size, k) => (
            <div key={k}>
              <PriceInput
                label={`${item.name || "Item"} ${size} price`}
                value={item.prices[k] ?? null}
                onChange={(v) => {
                  const prices = Array.from({ length: priceCount(section) }, (_, j) => item.prices[j] ?? null);
                  prices[k] = v;
                  onChange({ ...item, prices });
                }}
              />
              <span className="mt-1 block text-center text-[11px] text-ink-muted">{size}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          <IconButton label={item.hidden ? "Show on menu" : "Hide from menu"} onClick={() => onChange({ ...item, hidden: !item.hidden })}>
            {item.hidden ? <FiEyeOff /> : <FiEye />}
          </IconButton>
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <FiArrowUp />
          </IconButton>
          <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
            <FiArrowDown />
          </IconButton>
          <IconButton label="Delete item" className="hover:!bg-poppy-light hover:!text-poppy" onClick={onRemove}>
            <FiTrash2 />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function SectionEditor({ section, index, count, open, onToggle, onChange, onMove, onRemove }: {
  section: MenuSection;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  onChange: (s: MenuSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const setItems = (items: MenuItem[]) => onChange({ ...section, items });
  const visible = section.items.filter((i) => !i.hidden).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 p-2 pl-4">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex flex-1 items-center gap-3 py-2 text-left">
          <FiChevronDown className={`shrink-0 transition ${open ? "" : "-rotate-90"}`} />
          <span className="font-semibold">{section.title || "Untitled section"}</span>
          <span className="rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-ink-muted">
            {visible} item{visible === 1 ? "" : "s"}
          </span>
        </button>
        <IconButton label="Move section up" disabled={index === 0} onClick={() => onMove(-1)}>
          <FiArrowUp />
        </IconButton>
        <IconButton label="Move section down" disabled={index === count - 1} onClick={() => onMove(1)}>
          <FiArrowDown />
        </IconButton>
        <IconButton
          label="Delete section"
          className="hover:!bg-poppy-light hover:!text-poppy"
          onClick={() => {
            if (confirm(`Delete the whole "${section.title}" section and its ${section.items.length} items?`)) onRemove();
          }}
        >
          <FiTrash2 />
        </IconButton>
      </div>

      {open && (
        <div className="space-y-5 border-t border-ink/10 bg-cream/40 p-5 md:p-3">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <Field label="Section title">
              <Input value={section.title} onChange={(e) => onChange({ ...section, title: e.target.value })} />
            </Field>
            <Field label="Subtitle" hint='Optional, e.g. "Served until 11:30 AM"'>
              <Input value={section.subtitle ?? ""} onChange={(e) => onChange({ ...section, subtitle: e.target.value })} />
            </Field>
            <Field label="Sizes" hint='Comma-separated, e.g. "12 oz, 16 oz". Leave empty for a single price.'>
              <Input
                key={section.sizes.join(",")}
                defaultValue={section.sizes.join(", ")}
                onBlur={(e) => {
                  const sizes = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                  const n = Math.max(1, sizes.length);
                  onChange({
                    ...section,
                    sizes,
                    items: section.items.map((i) => ({
                      ...i,
                      prices: Array.from({ length: n }, (_, k) => i.prices[k] ?? null),
                    })),
                  });
                }}
              />
            </Field>
            <Field label="Notes" hint="Small print under the section. One per line.">
              <Textarea
                rows={2}
                value={section.notes.join("\n")}
                onChange={(e) => onChange({ ...section, notes: e.target.value.split("\n") })}
                onBlur={(e) => onChange({ ...section, notes: e.target.value.split("\n").map((n) => n.trim()).filter(Boolean) })}
              />
            </Field>
          </div>

          <div className="space-y-2">
            {section.items.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                section={section}
                index={i}
                count={section.items.length}
                onChange={(next) => setItems(section.items.map((x, j) => (j === i ? next : x)))}
                onMove={(dir) => setItems(move(section.items, i, i + dir))}
                onRemove={() => setItems(section.items.filter((_, j) => j !== i))}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setItems([
                ...section.items,
                { id: uid("item"), name: "", description: "", prices: Array(priceCount(section)).fill(null) },
              ])
            }
            className="btn w-full border-2 border-dashed border-ink/15 text-ink-soft hover:border-poppy hover:text-poppy"
          >
            <FiPlus /> Add item to {section.title || "section"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuEditor({ initial }: { initial: MenuData }) {
  const toast = useToast();
  const { draft, setDraft, setSaved, dirty, discard } = useDraft(initial);
  const [openId, setOpenId] = useState<string | null>(initial.sections[0]?.id ?? null);
  const [saving, setSaving] = useState(false);

  const setSections = (sections: MenuSection[]) => setDraft({ ...draft, sections });

  const save = async () => {
    // Drop blank rows left over from "Add item".
    const clean: MenuData = {
      sections: draft.sections.map((s) => ({ ...s, items: s.items.filter((i) => i.name.trim()) })),
    };
    setSaving(true);
    try {
      await saveContent("menu", clean);
      setDraft(clean);
      setSaved(clean);
      toast("Menu published");
    } catch (e) {
      toast(`Couldn't save: ${(e as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {draft.sections.map((s, i) => (
          <SectionEditor
            key={s.id}
            section={s}
            index={i}
            count={draft.sections.length}
            open={openId === s.id}
            onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            onChange={(next) => setSections(draft.sections.map((x, j) => (j === i ? next : x)))}
            onMove={(dir) => setSections(move(draft.sections, i, i + dir))}
            onRemove={() => setSections(draft.sections.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const id = uid("section");
          setSections([...draft.sections, { id, title: "New section", sizes: [], notes: [], items: [] }]);
          setOpenId(id);
        }}
        className="btn mt-4 w-full border-2 border-dashed border-ink/15 py-4 text-ink-soft hover:border-poppy hover:text-poppy"
      >
        <FiPlus /> Add a section
      </button>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
