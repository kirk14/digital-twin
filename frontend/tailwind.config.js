/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // slate-950
        panel: "rgba(15, 23, 42, 0.4)",
        panelBorder: "rgba(45, 212, 191, 0.2)",
        neon: {
          cyan: "#06b6d4",
          green: "#22c55e",
          blue: "#3b82f6",
        },
        primary: "#14b8a6", // teal-500
        text: {
          main: "#f8fafc",
          muted: "#94a3b8"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
        'fade-in': 'fade-in 0.5s ease-out forwards'
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
