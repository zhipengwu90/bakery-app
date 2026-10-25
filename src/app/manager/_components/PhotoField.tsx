"use client";

import { useRef, useState } from "react";
import { FiRotateCcw, FiUpload } from "react-icons/fi";
import { compressImage, UPLOAD_CACHE_CONTROL } from "@/app/utils/sql/compressImage";
import { createClient } from "@/app/utils/supabase/client";
import { DEFAULT_PHOTOS } from "@/lib/content/photos";
import type { PhotoSlot, SitePhoto } from "@/lib/content/types";
import { useToast } from "./ui";

export const PHOTO_BUCKET = "brazen_page";

/**
 * Pick a replacement for one of the site's fixed photos. The file is uploaded
 * straight away so it can be previewed; the editor publishes (or cleans it up)
 * when the owner saves or discards.
 */
export function PhotoField({ label, hint, slot, photo, aspect, maxSize, onChange }: {
  label: string;
  hint?: string;
  slot: PhotoSlot;
  photo: SitePhoto | undefined;
  /** CSS aspect ratio of the spot on the site, e.g. "4 / 3". */
  aspect: string;
  /** Longest edge in pixels after compression. */
  maxSize: number;
  onChange: (photo: SitePhoto | undefined) => void;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image file", "error");
    if (file.size > 15 * 1024 * 1024) return toast("That image is over 15 MB", "error");
    setBusy(true);
    try {
      const supabase = createClient();
      const compressed = await compressImage(file, maxSize, 0.4);
      const path = `site_${slot}_${Date.now()}`;
      const { error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, compressed, { cacheControl: UPLOAD_CACHE_CONTROL });
      if (error) throw error;
      onChange({ url: supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl, path });
    } catch (e) {
      toast(`Upload failed: ${(e as Error).message}`, "error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative w-36 shrink-0 overflow-hidden rounded-xl bg-ink/5 sm:w-28" style={{ aspectRatio: aspect }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo?.url ?? DEFAULT_PHOTOS[slot].img.src} alt="" className="h-full w-full object-cover" />
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-ink/50 text-xs font-medium text-white">Uploading…</div>
          )}
        </div>
        <div className="flex flex-col items-start gap-1">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="btn-outline !py-2">
            <FiUpload /> Replace photo
          </button>
          {photo && (
            <button type="button" onClick={() => onChange(undefined)} disabled={busy} className="btn-ghost !py-1.5 text-sm">
              <FiRotateCcw /> Use original photo
            </button>
          )}
          {hint && <span className="text-xs text-ink-muted">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
