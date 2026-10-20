"use client";

import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { FiImage, FiTrash2, FiUpload } from "react-icons/fi";
import { revalidateSite } from "@/app/actions/revalidate";
import { createClient } from "@/app/utils/supabase/client";
import type { FeaturedItem } from "@/lib/content/types";
import { Card, Field, Input, SaveBar, Textarea, Toggle, useDraft, useToast } from "./ui";

const BUCKET = "brazen_page";

export default function FeaturedEditor({ initial }: { initial: FeaturedItem | null }) {
  const toast = useToast();
  const [record, setRecord] = useState(initial);
  const { draft, setDraft, setSaved, dirty: textDirty, discard: discardText } = useDraft({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    is_displayed: initial?.is_displayed ?? true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const dirty = textDirty || !!file || removeImage;
  const shownImage = preview ?? (removeImage ? null : record?.img_url ?? null);

  const discard = () => {
    discardText();
    setFile(null);
    setRemoveImage(false);
  };

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast("Please choose an image file", "error");
    if (f.size > 15 * 1024 * 1024) return toast("That image is over 15 MB", "error");
    setFile(f);
    setRemoveImage(false);
  };

  const save = async () => {
    if (!draft.title.trim()) return toast("Please add a title", "error");
    setSaving(true);
    const supabase = createClient();
    try {
      const patch: Record<string, unknown> = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        is_displayed: draft.is_displayed,
        updated_at: new Date().toISOString(),
      };

      if (file) {
        const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1600, useWebWorker: true });
        const name = `newItem_${Date.now()}`;
        const { error } = await supabase.storage.from(BUCKET).upload(name, compressed);
        if (error) throw error;
        patch.img_url = supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
        patch.img_filename = name;
        patch.file_path = name;
      } else if (removeImage) {
        patch.img_url = null;
        patch.img_filename = null;
        patch.file_path = null;
      }

      const { data, error } = await supabase
        .from("brazen_page")
        .update(patch)
        .eq("id", 1)
        .eq("type", "newItem")
        .select("id, title, description, img_url, img_filename, is_displayed")
        .single();
      if (error) throw error;

      // Clean up the old picture once the new one is live.
      if ((file || removeImage) && record?.img_filename) {
        await supabase.storage.from(BUCKET).remove([record.img_filename]);
      }

      await revalidateSite();
      setRecord(data as FeaturedItem);
      const savedText = { title: data.title ?? "", description: data.description ?? "", is_displayed: data.is_displayed ?? true };
      setSaved(savedText);
      setDraft(savedText);
      setFile(null);
      setRemoveImage(false);
      toast("“What's new” published");
    } catch (e) {
      toast(`Couldn't save: ${(e as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_380px] items-start gap-6 xl:grid-cols-1">
      <div className="space-y-6">
        <Card>
          <Toggle
            checked={draft.is_displayed}
            onChange={(is_displayed) => setDraft({ ...draft, is_displayed })}
            label={draft.is_displayed ? "Showing on the homepage" : "Hidden from the homepage"}
          />
        </Card>

        <Card title="Text">
          <div className="space-y-4">
            <Field label="Title">
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={5} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Photo" description="Large photos are shrunk automatically before upload.">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline">
              <FiUpload /> {shownImage ? "Replace photo" : "Upload photo"}
            </button>
            {shownImage && (
              <button
                type="button"
                onClick={() => (file ? setFile(null) : setRemoveImage(true))}
                className="btn-ghost text-poppy hover:!bg-poppy-light hover:!text-poppy"
              >
                <FiTrash2 /> Remove photo
              </button>
            )}
            {file && <span className="text-sm text-ink-muted">New: {file.name}</span>}
          </div>
        </Card>
      </div>

      {/* Live preview, styled like the homepage card */}
      <div className="sticky top-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Preview</p>
        <div className={`overflow-hidden rounded-2xl bg-cream-deep p-3 ${draft.is_displayed ? "" : "opacity-50"}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-ink/30">
                <FiImage className="h-10 w-10" />
              </div>
            )}
            <span className="absolute left-3 top-3 grid h-14 w-14 -rotate-12 place-items-center rounded-full bg-poppy font-display text-sm font-semibold text-white">
              New!
            </span>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-poppy">Just out of the oven</p>
            <h3 className="mt-2 font-display text-2xl leading-tight">{draft.title || "Title"}</h3>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{draft.description}</p>
          </div>
        </div>
      </div>

      <div className="col-span-full">
        <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
      </div>
    </div>
  );
}
