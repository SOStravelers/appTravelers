/** @type {import('tailwindcss').Config} */
const defaultColors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 👈 Asegúrate de esto

  theme: {
    extend: {
      boxShadow: {
        darkNav: "0 4px 6px rgba(0, 0, 0, 0.5)", // sombra para fondo oscuro
      },
      colors: {
        brand: "var(--color-brand)",
        backgroundP: "var(--color-background-primary)",
        backgroundS: "var(--color-background-secondary)",
        textColor: "var(--color-text-color)",
        textColorGray: "var(--color-text-gray)",
        chipPrimary: "var(--color-chip-primary)",

        // tus colores custom, con nombres únicos para no borrar la paleta por defecto
        lightBlue: "#5B78C7",
        darkBlue: "#001C25",
        darkBlueSoft: "#253746",
        darkBlueCard: "#343B4B",
        blueBorder: "#00A0D5",
        newBlue: "#3498db",
        blueBorderTransparent: "rgba(0, 160, 213, 0.3)",
        dotBlue: "#1CDAE5",
        blueButton: "#ECF8FC",
        blackButton: "#001C25",
        transparentBlue: "rgba(91, 120, 199, 0.21)",
        blackText: "#2e2e2e",
        softWhite: "#fefefe",
        greyButton: "#ECEEEF",
        fb: "#3b5998",
        google: "#eee",

        // renombrados para no pisar `red` ni `green`
        brandRed: "rgb(239 68 68)",
        brandGreen: "rgba(0, 160, 6, 0.77)",

        // si quieres un gris custom, renómbralo también
        customGrey: "#4e4e4e",

        // si realmente quieres redefinir `white` y `black`, puedes:
        white: defaultColors.white,
        black: defaultColors.black,
        // el gris claro
        lightGrey: "#D9D9D9",
        greyText: "rgba(0, 0, 0, 0.44)",

        // y aprovechar el resto de la paleta por defecto:
        ...defaultColors,
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        opacity: "opacity",
        color: "color",
        backgroundColor: "background-color",
        borderColor: "border-color",
        scale: "transform",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 2s infinite",
      },

      fontSize: {
        xxs: "0.625rem", // 10px
      },
    },
  },
  plugins: [],
};
