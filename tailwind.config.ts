import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Enhanced dark mode palette
        dark: {
          bg: "#0f172a",
          surface: "#1e293b",
          card: "#1a2844",
          border: "#334155",
          text: "#f1f5f9",
          "text-secondary": "#cbd5e1",
          "text-muted": "#94a3b8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error:   "#EF4444",
        info:    "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-in-out",
        "scale-in":   "scaleIn 0.2s ease-in-out",
        "spin-slow":  "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        scaleIn: { "0%": { transform: "scale(0.95)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
