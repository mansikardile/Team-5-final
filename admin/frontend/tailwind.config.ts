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
        background: "var(--background)",
        foreground: "var(--foreground)",
        katalyst: {
          50: "#fdf2f8",
          100: "#fce7f3",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        brand: {
          dark: "#111827",
          sky: "#38bdf8",
          indigo: "#4f46e5",
          accent: "#0ea5e9",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset',
        'soft-glow': '0 0 50px -10px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
