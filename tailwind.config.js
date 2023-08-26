/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      azul: "#5B78C7",
      negroTexto: "#2e2e2e",
      blanco: "#FFFFFF",
      negro: "#000000",
      gris: "#4e4e4e",
      grisClaro: "#D9D9D9",
      grisTexto: "rgba(0, 0, 0, 0.44)"
    },
    extend: {},
  },
  plugins: [],
};
