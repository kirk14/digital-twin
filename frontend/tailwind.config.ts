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
        primary: {
          DEFAULT: "#1CBEB9",
          50: "#E8F8F8",
          100: "#D1F1F0",
          500: "#1CBEB9",
          600: "#17A4A0",
          700: "#138A86",
        },
        health: {
          green: "#22C55E",
          cyan: "#06B6D4",
          red: "#EF4444",
          amber: "#F59E0B",
        },
        bg: "#F8FAFC",
        card: "#FFFFFF",
        dark: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-md": "0 4px 16px 0 rgba(0,0,0,0.07), 0 1px 4px 0 rgba(0,0,0,0.04)",
        "card-lg": "0 8px 32px 0 rgba(0,0,0,0.08), 0 2px 8px 0 rgba(0,0,0,0.04)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-blue": "radial-gradient(at 40% 20%, #D1F1F0 0px, transparent 50%), radial-gradient(at 80% 0%, #E8F8F8 0px, transparent 50%), radial-gradient(at 0% 50%, #F0FDF4 0px, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.15)" },
          "70%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(28,190,185,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(28,190,185,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
