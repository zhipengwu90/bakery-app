-- Small WebP copy of each gallery photo (stored as "<file_path>_thumb" in the
-- foodPhoto bucket) so the homepage grid doesn't download full-size uploads.
-- Null for photos without one; the site falls back to img_url.

alter table public.brazen_page add column if not exists thumb_url text;
