# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

Next.js 15 App Router project for **Brazen Poppy Bakery** (Parksville, BC). TypeScript throughout, with Tailwind CSS as the primary styling system plus MUI/Emotion for select components.

**Path alias**: `@/*` maps to `./src/*`

### Key directories

- `src/app/(site)/` — Public pages sharing the header/footer layout: home (`page.tsx`), `menu/`, `about/`. Shared pieces in `(site)/_components/` (home sections under `_components/home/`).
- `src/app/admin/` — Staff login page; successful login redirects to `/manager`
- `src/app/manager/` — Protected "Website manager" dashboard. `_components/Dashboard.tsx` hosts tabbed editors: Menu, Hours, What's new, Photos, Site text
- `src/app/actions/revalidate.ts` — Server action the dashboard calls after saving so public pages refresh immediately
- `src/lib/content/` — Content layer: `types.ts` (data shapes), `defaults.ts` (fallback content), `server.ts` (public reads), `hours.ts` / `format.ts` (helpers)
- `src/app/utils/supabase/` — Supabase clients: `client.ts` (browser), `server.ts` (SSR, cookie-based auth)
- `src/app/utils/sql/` — Gallery mutations (`uploadFoodImg`, `deleteFoodImg`, `updateFoodImgOrder`)
- `supabase/migrations/` — SQL migrations (apply via Supabase dashboard/CLI)

### Data & backend

- **Database**: Supabase (PostgreSQL). Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
- **Auth**: `/manager` checks `supabase.auth.getUser()` server-side and redirects to `/admin`. (The root `middleware.ts` is not picked up because the app lives in `src/`.)
- **Editable content** (`site_content` table, one row per key, JSON in `data`): `menu`, `hours`, `settings` (announcement bar, hero text, contact info, About-page story, legal name). Shapes in `src/lib/content/types.ts`. If a row is missing or Supabase errors, `getContent()` falls back to `src/lib/content/defaults.ts`.
- **What's new** (homepage feature): `brazen_page` row `id=1` / `type="newItem"`; `is_displayed` toggles it. Images in storage bucket `brazen_page`.
- **Food gallery**: `brazen_page` rows with `type="foodImg"`, ordered by `img_display_order` descending (unique). Images in storage bucket `foodPhoto`.
- **Caching**: public pages are statically rendered with `revalidate = 300`; dashboard saves call `revalidateSite()` for instant updates.

### Design system

Tailwind tokens in `tailwind.config.ts`: `cream`, `ink`, `poppy`, `leaf`, `crust`; fonts `font-display` (Fraunces) and `font-sans` (DM Sans). Component classes (`container-page`, `eyebrow`, `btn-primary`, `btn-outline`, `btn-ghost`, `leader`) in `globals.css`. Breakpoints are **desktop-first** (`md:` = max-width 767px).

### Notable libraries

- **Browser Image Compression** — client-side image compression in dashboard uploads
- **React Icons** — icons (`react-icons/fi` mostly)
- MUI, Motion and Embla are still in `package.json` but no longer used
- **Google Analytics** — tag `G-MJ9SM199H3` embedded in root layout

### Image handling

Remote images from Supabase storage are whitelisted in `next.config.ts` under `remotePatterns`. Add new storage domains there if needed.
