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
      azulClaro: "rgba(91, 120, 199, 0.21)",
      negroTexto: "#2e2e2e",
      blanco: "#FFFFFF",
      negro: "#000000",
      gris: "#4e4e4e",
      grisClaro: "#D9D9D9",
      grisTexto: "rgba(0, 0, 0, 0.44)",
      error: "rgb(239 68 68)",
      success: "rgba(0, 160, 6, 0.77)",
      grisBoton: "#000000C4",
      fb: "#3b5998",
      google: "#eee",
    },
    extend: {},
  },
  plugins: [],
};
