"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { FaUpload, FaImage, FaTrash, FaSort, FaSave, FaTimes } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import Image from "next/image";
import getFoodImg from "@/app/utils/sql/getFoodImg";
import uploadFoodImg from "@/app/utils/sql/uploadFoodImg";
import deleteFoodImg from "@/app/utils/sql/deleteFoodImg";
import updateFoodImgOrder from "@/app/utils/sql/updateFoodImgOrder";

interface FoodImgRecord {
  id: number;
  img_url: string;
  img_filename: string;
  file_path: string;
  type: string;
  img_display_order: number;
}

const FoodGallery = () => {
  const [foodImgs, setFoodImgs] = useState<FoodImgRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedImgs, setReorderedImgs] = useState<FoodImgRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchFoodImgs = async () => {
    setLoading(true);
    try {
      const result = await getFoodImg();
      if (result.success && result.data) {
        setFoodImgs(result.data as FoodImgRecord[]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (galleryInputRef.current) galleryInputRef.current.value = "";

    const nextOrder = foodImgs.reduce((max, img) => Math.max(max, img.img_display_order ?? 0), 0) + 1;

    setUploading(true);
    try {
      const result = await uploadFoodImg(file, nextOrder);
      if (result.success) {
        showSnackbar("Photo uploaded successfully.", "success");
        await fetchFoodImgs();
      } else {
        showSnackbar(result.error || "Upload failed.", "error");
      }
    } catch {
      showSnackbar("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: FoodImgRecord) => {
    if (!confirm("Delete this photo?")) return;
    const result = await deleteFoodImg(img.id, img.file_path);
    if (result.success) {
      showSnackbar("Photo deleted.", "success");
      setFoodImgs((prev) => prev.filter((f) => f.id !== img.id));
    } else {
      showSnackbar(result.error || "Delete failed.", "error");
    }
  };

  // ── Reorder ───────────────────────────────────────────────────────────────

  const enterReorderMode = () => {
    // Gallery is displayed descending, so reverse for editing (index 0 = highest order)
    setReorderedImgs([...foodImgs].sort((a, b) => b.img_display_order - a.img_display_order));
    setReorderMode(true);
  };

  const cancelReorder = () => {
    setReorderMode(false);
    setReorderedImgs([]);
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const updated = [...reorderedImgs];
    const [dragged] = updated.splice(dragIndex.current, 1);
    updated.splice(index, 0, dragged);
    dragIndex.current = index;
    setReorderedImgs(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragIndex.current = null;
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      // First item in the grid = highest img_display_order (descending display)
      const total = reorderedImgs.length;
      const items = reorderedImgs.map((img, index) => ({
        id: img.id,
        img_display_order: total - index, // index 0 → highest value
      }));

      const result = await updateFoodImgOrder(items);
      if (result.success) {
        showSnackbar("Order saved.", "success");
        await fetchFoodImgs();
        setReorderMode(false);
        setReorderedImgs([]);
      } else {
        showSnackbar(result.error || "Failed to save order.", "error");
      }
    } catch {
      showSnackbar("Failed to save order.", "error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchFoodImgs();
  }, []);

  const displayImgs = reorderMode
    ? reorderedImgs
    : [...foodImgs].sort((a, b) => b.img_display_order - a.img_display_order);

  return (
    <div className="col-span-6 lg:col-span-6 md:col-span-12 sm:col-span-12 bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-red-700">Food Gallery</h2>
        <div className="flex items-center gap-2">
          {reorderMode ? (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaTimes />}
                onClick={cancelReorder}
                disabled={saving}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <FaSave />}
                onClick={saveOrder}
                disabled={saving}
                sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
              >
                {saving ? "Saving…" : "Save Order"}
              </Button>
            </>
          ) : (
            <>
              {foodImgs.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<FaSort />}
                  onClick={enterReorderMode}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Reorder
                </Button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <FaUpload />}
                disabled={uploading}
                onClick={() => galleryInputRef.current?.click()}
                sx={{
                  textTransform: "none", fontWeight: "bold", borderRadius: 2,
                  "&:hover": { transform: "translateY(-1px)" },
                  transition: "all 0.2s ease",
                }}
              >
                {uploading ? "Uploading…" : "Upload Photo"}
              </Button>
            </>
          )}
        </div>
      </div>

      {reorderMode && (
        <p className="text-xs text-gray-400 mb-3">Drag photos to reorder, then click Save Order.</p>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress color="error" />
        </div>
      ) : foodImgs.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <FaImage className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">No photos yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Upload Photo" to add images</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-[520px] overflow-y-auto pr-1" style={{ gridAutoRows: "120px" }}>
          {displayImgs.map((img, index) => (
            <div
              key={img.id}
              draggable={reorderMode}
              onDragStart={reorderMode ? () => handleDragStart(index) : undefined}
              onDragOver={reorderMode ? (e) => handleDragOver(e, index) : undefined}
              onDrop={reorderMode ? handleDrop : undefined}
              className={`relative group rounded-lg overflow-hidden shadow
                ${reorderMode ? "cursor-grab active:cursor-grabbing ring-2 ring-red-200" : ""}`}
            >
              <Image
                src={img.img_url}
                alt="Food photo"
                fill
                className={`object-cover transition-transform duration-300 ${!reorderMode ? "group-hover:scale-105" : ""}`}
              />

              {reorderMode ? (
                /* Drag handle overlay */
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <MdDragIndicator size={32} className="text-white drop-shadow" />
                </div>
              ) : (
                /* Delete overlay */
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                    aria-label="Delete photo"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FoodGallery;
