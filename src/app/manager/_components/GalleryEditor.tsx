"use client";

import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiImage, FiTrash2, FiUpload } from "react-icons/fi";
import { revalidateSite } from "@/app/actions/revalidate";
import { createClient } from "@/app/utils/supabase/client";
import deleteFoodImg from "@/app/utils/sql/deleteFoodImg";
import updateFoodImgOrder from "@/app/utils/sql/updateFoodImgOrder";
import uploadFoodImg from "@/app/utils/sql/uploadFoodImg";
import type { GalleryPhoto } from "@/lib/content/types";
import { IconButton, SaveBar, useToast } from "./ui";

async function fetchGallery(): Promise<GalleryPhoto[]> {
  const { data } = await createClient()
    .from("brazen_page")
    .select("id, img_url, thumb_url, file_path, img_display_order")
    .eq("type", "foodImg")
    .order("img_display_order", { ascending: false });
  return (data ?? []) as GalleryPhoto[];
}

export default function GalleryEditor({ initial }: { initial: GalleryPhoto[] }) {
  const toast = useToast();
  const [saved, setSaved] = useState(initial);
  const [order, setOrder] = useState(initial);
  const [progress, setProgress] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const orderDirty = order.map((p) => p.id).join() !== saved.map((p) => p.id).join();

  const reload = async () => {
    const fresh = await fetchGallery();
    setSaved(fresh);
    setOrder(fresh);
  };

  const upload = async (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    // New photos go to the front of the gallery (highest display order first).
    let next = saved.reduce((m, p) => Math.max(m, p.img_display_order ?? 0), 0) + 1;
    let failed = 0;
    for (let i = 0; i < images.length; i++) {
      setProgress(`Uploading ${i + 1} of ${images.length}…`);
      const result = await uploadFoodImg(images[i], next++);
      if (!result.success) failed++;
    }
    setProgress(null);
    await reload();
    await revalidateSite();
    const ok = images.length - failed;
    if (ok) toast(`${ok} photo${ok === 1 ? "" : "s"} added`);
    if (failed) toast(`${failed} photo${failed === 1 ? "" : "s"} failed to upload`, "error");
  };

  const remove = async (photo: GalleryPhoto) => {
    if (!confirm("Delete this photo from the website?")) return;
    const result = await deleteFoodImg(photo.id, photo.file_path);
    if (!result.success) return toast(result.error ?? "Delete failed", "error");
    setSaved((s) => s.filter((p) => p.id !== photo.id));
    setOrder((s) => s.filter((p) => p.id !== photo.id));
    await revalidateSite();
    toast("Photo deleted");
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    const copy = [...order];
    const [x] = copy.splice(from, 1);
    copy.splice(to, 0, x);
    setOrder(copy);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    const total = order.length;
    const result = await updateFoodImgOrder(order.map((p, i) => ({ id: p.id, img_display_order: total - i })));
    setSavingOrder(false);
    if (!result.success) return toast(result.error ?? "Couldn't save order", "error");
    await reload();
    await revalidateSite();
    toast("Photo order published");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) upload(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={!!progress}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? "border-poppy bg-poppy-light/40" : "border-ink/15 bg-white hover:border-poppy"
        }`}
      >
        <FiUpload className="h-7 w-7 text-poppy" />
        <span className="font-semibold">{progress ?? "Add photos"}</span>
        <span className="text-sm text-ink-muted">Drop images here or tap to choose — you can pick several at once.</span>
      </button>

      <p className="mb-3 mt-8 text-sm text-ink-muted">
        {order.length} photo{order.length === 1 ? "" : "s"} · The first one is shown large on the homepage. Drag to reorder, or use the arrows.
      </p>

      {order.length === 0 ? (
        <div className="grid place-items-center rounded-2xl bg-white py-16 text-ink/30">
          <FiImage className="h-10 w-10" />
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
          {order.map((photo, i) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragIndex.current === null || dragIndex.current === i) return;
                move(dragIndex.current, i);
                dragIndex.current = i;
              }}
              onDragEnd={() => (dragIndex.current = null)}
              className="group relative aspect-square cursor-grab overflow-hidden rounded-xl bg-ink/5 shadow-sm ring-1 ring-ink/10 active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.thumb_url ?? photo.img_url} alt="" className="h-full w-full object-cover" draggable={false} />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/70 to-transparent p-1.5 pt-6 text-white">
                <div className="flex">
                  <IconButton label="Move earlier" disabled={i === 0} onClick={() => move(i, i - 1)} className="!text-white hover:!bg-white/20">
                    <FiArrowLeft />
                  </IconButton>
                  <IconButton label="Move later" disabled={i === order.length - 1} onClick={() => move(i, i + 1)} className="!text-white hover:!bg-white/20">
                    <FiArrowRight />
                  </IconButton>
                </div>
                <IconButton label="Delete photo" onClick={() => remove(photo)} className="!text-white hover:!bg-poppy">
                  <FiTrash2 />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <SaveBar dirty={orderDirty} saving={savingOrder} onSave={saveOrder} onDiscard={() => setOrder(saved)} />
    </div>
  );
}
