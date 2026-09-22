import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta editorial creme+dourado. Cada plataforma pode personalizar via CSS vars.
        cream: {
          50: "var(--cream-50)",
          100: "var(--cream-100)",
          200: "var(--cream-200)",
        },
        gold: {
          50: "var(--gold-50)",
          100: "var(--gold-100)",
          200: "var(--gold-200)",
          300: "var(--gold-300)",
          500: "var(--gold-500)",
          600: "var(--gold-600)",
          700: "var(--gold-700)",
          800: "var(--gold-800)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          faint: "var(--ink-faint)",
        },
        success: "var(--success)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-foil":
          "linear-gradient(135deg, var(--gold-600), var(--gold-500), var(--gold-700))",
        "gold-gradient":
          "linear-gradient(135deg, var(--gold-50), var(--gold-100))",
        "gold-gradient-rich":
          "linear-gradient(135deg, var(--gold-100), var(--gold-200))",
      },
    },
  },
  plugins: [],
};

export default config;
