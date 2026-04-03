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
- `admin/` — Admin dashboard (protected, login via `admin/loginPart/actions.ts`)
- `manager/` — Manager page with context state (`manager/part/Context.tsx`)
- `components/` — Shared components: `NavBar.tsx`, `Footer.tsx`, `Logo.tsx`, `Icons.tsx`
- `utils/supabase/` — Supabase clients: `client.ts` (browser), `server.ts` (SSR), `middleware.ts`
- `utils/sql/` — DB query helpers (`getNewItem`, `updateNewItem`)

### Data & backend

- **Database**: Supabase (PostgreSQL). Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required in `.env`.
- **Auth**: Session management in `middleware.ts` (root) guards `/admin` and `/manager` routes.
- **Menu content**: Static data in `src/app/menu/menu.json`; dynamic "new items" fetched from Supabase.

### Notable libraries

- **Motion** (Framer Motion v11 fork) — page/component animations
- **Embla Carousel** — image sliders in `FoodPhoto.tsx`
- **MUI Material + Icons** — used alongside Tailwind for select UI elements
- **Browser Image Compression** — client-side image compression in admin upload flow
- **React Icons** — icon library (re-exported from `components/Icons.tsx`)
- **Google Analytics** — tag `G-MJ9SM199H3` embedded in root layout

### Image handling

Remote images from Supabase storage are whitelisted in `next.config.ts` under `remotePatterns`. Add new storage domains there if needed.
