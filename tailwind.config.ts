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
        // Fundos por nível de navegação, do mais escuro ao mais claro:
        // Destinos em alta (home) > países > estados > cidades > atrações.
        // Os dois primeiros levam texto claro; os demais, texto escuro.
        "fundo-alta": "#5C3F2D",
        "fundo-paises": "#7A5B44",
        "fundo-estados": "#DAC39E",
        "fundo-cidades": "#E5D4B6",
        "fundo-atracoes": "#F0E6D2",
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
