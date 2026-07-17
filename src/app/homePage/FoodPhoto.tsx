"use client";
import React, { useState, useCallback, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import getFoodImg from "../utils/sql/getFoodImg";

interface FoodImgRecord {
  id: number;
  img_url: string;
  img_display_order: number;
}

const shimmerDataUrl =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23f3f4f6'/%3E%3C/svg%3E";

const FoodPhoto = () => {
  const [photos, setPhotos] = useState<FoodImgRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");
  const cols = isLargeScreen ? 4 : isSmallScreen ? 2 : 3;

  useEffect(() => {
    let isMounted = true;

    getFoodImg().then((result) => {
      if (isMounted && result.success && result.data) {
        setPhotos(result.data as FoodImgRecord[]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, handlePrev, handleNext]);

  useEffect(() => {
    if (selectedIndex === null || photos.length < 2) return;

    const nextIndex = (selectedIndex + 1) % photos.length;
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;

    [photos[nextIndex]?.img_url, photos[prevIndex]?.img_url].forEach((src) => {
      if (!src) return;

      const image = new window.Image();
      image.src = src;
    });
  }, [selectedIndex, photos]);

  const current = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div className="my-3">
      <div className="flex flex-row items-center justify-center w-full my-8">
        <div className="flex-grow border-t border-red-500"></div>
        <div className="px-4 text-center text-2xl font-bold text-red-500">
          Delicious Foods
        </div>
        <div className="flex-grow border-t border-red-500"></div>
      </div>

      <div
        className="grid gap-1 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: isSmallScreen ? "140px" : "200px",
        }}
      >
        {photos.map((photo, index) => {
          const isFeatured = index === 0 && photos.length > 1;
          return (
            <div
              key={photo.id}
              className="relative cursor-pointer overflow-hidden group"
              style={isFeatured ? { gridColumn: "span 2", gridRow: "span 2" } : {}}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={photo.img_url}
                alt="Food photo"
                fill
                priority={index < cols}
                sizes={
                  isFeatured
                    ? "(max-width: 600px) 100vw, (min-width: 1200px) 50vw, 66vw"
                    : "(max-width: 600px) 50vw, (min-width: 1200px) 25vw, 33vw"
                }
                quality={75}
                placeholder="blur"
                blurDataURL={shimmerDataUrl}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      <Modal
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Prev button — fixed to left edge */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
            aria-label="Previous photo"
          >
            <IoChevronBack size={24} />
          </button>

          {/* Image */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {current && (
              <Image
                src={current.img_url}
                alt="Food photo"
                width={800}
                height={600}
                priority
                sizes="90vw"
                quality={75}
                placeholder="blur"
                blurDataURL={shimmerDataUrl}
                className="rounded-lg shadow-lg max-h-[80vh] w-auto object-contain"
              />
            )}

            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Close"
            >
              <IoClose size={20} />
            </button>

            {/* Counter */}
            {selectedIndex !== null && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Next button — fixed to right edge */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
            aria-label="Next photo"
          >
            <IoChevronForward size={24} />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FoodPhoto;
