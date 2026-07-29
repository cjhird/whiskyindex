/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@whiskyindex/ui",
    "@whiskyindex/schemas",
    "@whiskyindex/data",
    "@whiskyindex/supabase",
  ],
};

export default nextConfig;
