import whiskyindexPreset from "@whiskyindex/config-tailwind/preset";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: whiskyindexPreset.darkMode,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: whiskyindexPreset.theme,
  plugins: whiskyindexPreset.plugins,
};

export default config;
