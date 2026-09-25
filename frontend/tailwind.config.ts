import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef5f8",
          100: "#d6e8ee",
          200: "#a9cedb",
          300: "#77b0c4",
          400: "#4790a8",
          500: "#28748c",
          600: "#0e5872", // primary
          700: "#0a4459",
          800: "#083647",
          900: "#092b39",
        },
        palm: {
          50: "#eefaf3",
          100: "#d3f2e0",
          200: "#a3e2bf",
          300: "#6fce9c",
          400: "#41b87d",
          500: "#219c63", // secondary
          600: "#187d4f",
          700: "#146341",
          800: "#124f36",
          900: "#0f412d",
        },
        sand: {
          50: "#fdfcfa",
          100: "#f8f5ee", // background
          200: "#f0ebdc",
        },
        ink: {
          700: "#2c3a3f",
          800: "#1c2a2e",
          900: "#122023", // text
        },
        gold: {
          400: "#f2b134", // CTA accent
          500: "#e39d1c",
          600: "#c2860f",
        },
      },
      fontFamily: {
        // Geometric, confident display face for headlines
        display: [
          "Avenir Next",
          "Poppins",
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        // Clean, highly legible body face
        body: [
          "Inter",
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(9, 43, 57, 0.12)",
        card: "0 8px 30px -8px rgba(9, 43, 57, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dash": {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "dash": "dash 2.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
