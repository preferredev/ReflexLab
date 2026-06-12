import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a12",
        panel: "#12121e",
        glow: "#22d3ee",
      },
      boxShadow: {
        neon: "0 0 18px rgba(34, 211, 238, 0.35)",
        "neon-sm": "0 0 10px rgba(34, 211, 238, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
