import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ftg: {
          bg: "#0A0A0C",
          surface: "#121215",
          elevated: "#18181C",
          "border-strong": "#23232A",
          "border-subtle": "#1A1A1F",
          text: "#F5F2E8",
          "text-dim": "#8A8580",
          "text-mute": "#5A554F",
          amber: "#F5B544",
          "amber-bright": "#FFD17A",
          "amber-dim": "#8B6420",
          "amber-glow": "rgba(245, 181, 68, 0.12)",
          success: "#7BC96F",
          danger: "#E5484D",
          "mountain-1": "#0E0E11",
          "mountain-2": "#161619",
          "mountain-3": "#1E1E22",
        },
      },
      fontFamily: {
        display: ["VT323", "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        "ftg-card": "10px",
        "ftg-shell": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
