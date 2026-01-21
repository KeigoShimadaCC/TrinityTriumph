/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          red: "#ff003c",
          cyan: "#00f0ff",
          green: "#00ff41",
          ink: "#050505"
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 240, 255, 0.35)",
        heat: "0 0 25px rgba(255, 0, 60, 0.45)"
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translate3d(-8px, 0, 0)" },
          "20%, 40%, 60%, 80%": { transform: "translate3d(8px, 0, 0)" }
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        shake: "shake 0.35s ease-in-out",
        pulseSlow: "pulseSlow 2.5s ease-in-out infinite"
      },
      fontFamily: {
        display: ["'Oxanium'", "system-ui", "sans-serif"],
        mono: ["'Share Tech Mono'", "ui-monospace", "SFMono-Regular"]
      }
    }
  },
  plugins: []
};
