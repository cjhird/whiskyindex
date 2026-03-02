# WhiskyIndex

Investment analytics for whisky collectors. Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy the example env file and add your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anon/public key

   Create a project at [supabase.com](https://supabase.com) if you don’t have one yet.

3. **Supabase database (schema, RLS, RPCs)**

   In your Supabase project, open **SQL Editor** and run the scripts in `supabase_mirror/` in this order:

   1. **schema.sql** – tables and indexes  
   2. **rls.sql** – row-level security policies  
   3. **rpcs.sql** – `search_bottles`, `get_bottle_metrics`, `get_latest_prices`  
   4. **seed.sql** (optional) – demo bottles and price history for testing  

   Copy-paste each file’s contents and run. After that, the app can use the database.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS, ESLint
- **Supabase** (auth + Postgres)
- **TanStack Query**, **Zod**, **Recharts**, **react-hook-form** + **@hookform/resolvers**
