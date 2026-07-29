# WhiskyIndex monorepo

Investment analytics for whisky collectors. pnpm workspaces + Turborepo.

## Structure

```
apps/
  marketing/   # Public marketing site (port 3000)
  platform/    # Product app — screener, portfolio, auth (port 3001)
packages/
  data/        # Mock fixtures + in-memory search (frontend dev)
  schemas/     # Shared Zod schemas
  supabase/    # Supabase client helpers
  ui/          # Shared UI (shadcn-style components)
supabase/      # Database migrations + seed
```

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment**

   Copy env examples for each app:

   ```bash
   cp apps/platform/.env.local.example apps/platform/.env.local
   cp apps/marketing/.env.local.example apps/marketing/.env.local
   ```

   **Platform** (`apps/platform/.env.local`):

   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` when connected to Supabase
   - `NEXT_PUBLIC_USE_MOCK_DATA=true` — uses `@whiskyindex/data` fixtures (default when Supabase is not configured)

   **Marketing** (`apps/marketing/.env.local`):

   - `NEXT_PUBLIC_PLATFORM_URL` — link target for CTAs (default `http://localhost:3001`)

3. **Supabase database**

   Install the [Supabase CLI](https://supabase.com/docs/guides/cli), link your project, then push migrations:

   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

   Migrations live in `supabase/migrations/`. Seed data is in `supabase/seed.sql` (demo bottles aligned with mock fixtures).

   Legacy SQL files were consolidated into migrations; do not use `supabase_mirror/`.

4. **Run dev servers**

   ```bash
   pnpm dev
   ```

   - Marketing: http://localhost:3000
   - Platform: http://localhost:3001

   Or run individually:

   ```bash
   pnpm dev:marketing
   pnpm dev:platform
   ```

## Tech stack

- **Next.js 15** (App Router), React 19, TypeScript, Tailwind CSS
- **Turborepo** + **pnpm** workspaces
- **Supabase** (auth + Postgres)
- **TanStack Query** + **TanStack Table**, **Zod**, **Recharts**
- **shadcn-style UI** in `@whiskyindex/ui`
