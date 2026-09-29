import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        dark: {
          bg: "#090d16",
          card: "#111827",
          border: "#1f2937",
          muted: "#9ca3af",
        },
        risk: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#eab308",
          low: "#10b981",
        }
      },
    },
  },
  plugins: [],
};
export default config;
