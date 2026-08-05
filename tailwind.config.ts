import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracota: "#C1653A",
        oliva: "#4A5D43",
        areia: "#F0E6D2",
        tinta: "#2B2620",
        branco: "#FFFFFF",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
};

export default config;
