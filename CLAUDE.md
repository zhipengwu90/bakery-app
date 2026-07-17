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

### Key directories under `src/app/`

- `homePage/` — Home page sections (hero, new items, hours, photo carousel)
- `menu/` — Menu page; menu data lives in `menu/menu.json`
- `about/` — About page
- `admin/` — Login page only; successful login redirects to `/manager`
- `manager/` — Protected dashboard (`manager/part/Context.tsx`): edit the "New Item" homepage section and manage the food photo gallery with drag-to-reorder
- `components/` — Shared components: `NavBar.tsx`, `Footer.tsx`, `Logo.tsx`, `Icons.tsx`
- `utils/supabase/` — Supabase clients: `client.ts` (browser), `server.ts` (SSR), `middleware.ts`
- `utils/sql/` — DB query helpers (`getNewItem`, `updateNewItem`)

### Data & backend

- **Database**: Supabase (PostgreSQL). Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
- **Auth**: Session management in `middleware.ts` (root) guards `/manager`; login uses `supabase.auth.signInWithPassword`.
- **Menu content**: Fully static in `src/app/menu/menu.json` — edit that file to change prices or items.
- **Business hours**: Fully static in `src/app/homePage/hoursData.ts` (`WEEKLY_HOURS` array) — edit that file to change hours.
- **New Item section** (homepage): Dynamic — stored in Supabase table `brazen_page`, row `id=1` / `type="newItem"`. Fields: `title`, `description`, `img_url`, `img_filename`, `file_path`.
- **Food gallery** (homepage carousel): Dynamic — rows in `brazen_page` with `type="foodImg"`, ordered by `img_display_order` descending. Managed via the `/manager` dashboard.

### Notable libraries

- **Motion** (Framer Motion v11 fork) — page/component animations
- **Embla Carousel** — image sliders in `FoodPhoto.tsx`
- **MUI Material + Icons** — used alongside Tailwind for select UI elements
- **Browser Image Compression** — client-side image compression in admin upload flow
- **React Icons** — icon library (re-exported from `components/Icons.tsx`)
- **Google Analytics** — tag `G-MJ9SM199H3` embedded in root layout

### Image handling

Remote images from Supabase storage are whitelisted in `next.config.ts` under `remotePatterns`. Add new storage domains there if needed.
