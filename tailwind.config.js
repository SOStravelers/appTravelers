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
        backgroundModal: "var(--color-background-modal)",
        backgroundCard: "var(--color-background-card)",
        backgroundCardSecondary: "var(--color-background-card-secondary)",
        backgroundNavbar: "var(--color-background-navbar)",
        buttonLight: "var(--color-button-light)",
        buttonHeavy: "var(--color-button-heavy)",
        buttonGray: "var(--color-button-gray)",
        textColor: "var(--color-text-color)",
        textColorI: "var(--color-text-colorI)",
        textColorGray: "var(--color-text-gray)",
        textColorGreen: "var(--color-text-green)",
        textColorGrayReverse: "var(--color-text-gray-reverse)",
        chipPrimary: "var(--color-chip-primary)",
        inputColor: "var(--color-input)",
        errorColor: "var(--color-error)",
        warningColor: "var(--color-warning)",

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
