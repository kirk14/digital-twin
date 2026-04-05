/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "surface-container-highest": "#1c253e",
        "on-tertiary-fixed-variant": "#0d6200",
        "on-background": "#dfe4fe",
        "on-secondary-fixed-variant": "#00675f",
        "inverse-primary": "#006a6e",
        "primary-fixed": "#00f4fe",
        "inverse-surface": "#faf8ff",
        "tertiary-container": "#2ff801",
        "secondary": "#57fae9",
        "surface-container": "#11192e",
        "on-error": "#490006",
        "outline": "#6f758b",
        "background": "#070d1f",
        "secondary-fixed": "#57fae9",
        "on-surface": "#dfe4fe",
        "on-primary-fixed": "#004346",
        "surface-bright": "#222b47",
        "on-tertiary-fixed": "#064200",
        "on-secondary-container": "#dcfff9",
        "tertiary": "#8eff71",
        "error-dim": "#d7383b",
        "surface-container-high": "#171f36",
        "primary": "#a1faff",
        "inverse-on-surface": "#4f5469",
        "error-container": "#9f0519",
        "primary-dim": "#00e5ee",
        "on-primary-fixed-variant": "#006266",
        "tertiary-fixed": "#2ff801",
        "on-secondary": "#005c55",
        "outline-variant": "#41475b",
        "surface-container-lowest": "#000000",
        "primary-fixed-dim": "#00e5ee",
        "surface": "#070d1f",
        "secondary-dim": "#43ecdb",
        "surface-tint": "#a1faff",
        "surface-dim": "#070d1f",
        "tertiary-dim": "#2be800",
        "secondary-container": "#006a62",
        "surface-container-low": "#0c1326",
        "on-tertiary": "#0d6100",
        "on-tertiary-container": "#0b5800",
        "primary-container": "#00f4fe",
        "tertiary-fixed-dim": "#2be800",
        "on-primary-container": "#00575b",
        "on-surface-variant": "#a5aac2",
        "on-secondary-fixed": "#004842",
        "on-primary": "#006165",
        "error": "#ff716c",
        "surface-variant": "#1c253e",
        "on-error-container": "#ffa8a3",
        "secondary-fixed-dim": "#43ecdb"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "fontFamily": {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"],
        "technical": ["Space Grotesk", "sans-serif"],
        "sans": ["Manrope", "sans-serif"]
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.5)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.5)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'spin-slow': 'spin 10s linear infinite',
        'spin-slow-reverse': 'spin 15s linear infinite reverse',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' },
          '50%': { opacity: .7, filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.1)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
