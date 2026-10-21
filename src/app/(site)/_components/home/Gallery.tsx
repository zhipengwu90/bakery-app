"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiInstagram, FiX } from "react-icons/fi";
import type { GalleryPhoto } from "@/lib/content/types";

const INITIAL = 9;

export default function Gallery({ photos, instagram }: { photos: GalleryPhoto[]; instagram?: string }) {
  const [showAll, setShowAll] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const visible = showAll ? photos : photos.slice(0, INITIAL);
  const count = photos.length;

  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % count)), [count]);

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, prev, next]);

  // Preload neighbours so arrowing through feels instant.
  useEffect(() => {
    if (index === null || count < 2) return;
    [photos[(index + 1) % count], photos[(index - 1 + count) % count]].forEach((p) => {
      const img = new window.Image();
      img.src = p.img_url;
    });
  }, [index, photos, count]);

  return (
    <section className="bg-cream-deep py-24 md:py-16">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 md:flex-col md:items-start">
          <div>
            <p className="eyebrow">From our kitchen</p>
            <h2 className="mt-4 font-display text-5xl leading-tight lg:text-4xl">
              Baked this <em className="italic text-poppy">morning</em>
            </h2>
          </div>
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0">
              <FiInstagram /> Follow along
            </a>
          )}
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-4 gap-3 lg:auto-rows-[180px] lg:grid-cols-3 md:grid-cols-2 md:auto-rows-[150px]">
          {visible.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo ${i + 1} of ${count}`}
              className={`group relative overflow-hidden rounded-2xl bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-poppy ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
                src={photo.thumb_url ?? photo.img_url}
                alt=""
                fill
                sizes={i === 0 ? "(max-width: 767px) 92vw, 560px" : "(max-width: 767px) 46vw, 280px"}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/15" />
            </button>
          ))}
        </div>

        {count > INITIAL && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setShowAll((s) => !s)} className="btn-outline">
              {showAll ? "Show fewer" : `See all ${count} photos`}
            </button>
          </div>
        )}
      </div>

      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setIndex(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            touchX.current = null;
          }}
        >
          <div className="relative h-[82vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[index].img_url} alt="" fill sizes="90vw" className="object-contain" priority />
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={() => setIndex(null)}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <FiX className="h-5 w-5" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
                className="absolute left-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:hidden"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
                className="absolute right-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:hidden"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {index + 1} / {count}
          </p>
        </div>
      )}
    </section>
  );
}
