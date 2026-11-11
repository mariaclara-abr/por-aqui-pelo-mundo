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
        // areia escura: fundo da seção de destinos da home, com texto claro (contraste AA)
        "areia-escura": "#5C3F2D",
        tinta: "#2B2620",
        branco: "#FFFFFF",
      },
      fontFamily: {
        // Lora é a fonte de todos os títulos do site
        serif: ["var(--font-lora)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        lora: ["var(--font-lora)", "serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
};

export default config;
