import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--c-base) / <alpha-value>)",
        "base-card": "rgb(var(--c-base-card) / <alpha-value>)",
        bone: "rgb(var(--c-bone) / <alpha-value>)",
        "bone-dim": "rgb(var(--c-bone-dim) / <alpha-value>)",
        "bone-faint": "rgb(var(--c-bone-faint) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        amber: "rgb(var(--c-amber) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
