export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseEnv();
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder") &&
      !url.includes("your-project")
  );
}

export function shouldUseMockData(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") return true;
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false") return false;
  return !isSupabaseConfigured();
}
