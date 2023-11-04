/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      lightBlue: "#5B78C7",
      darkBlue: "#001C25",
      blueBorder: "#00A0D5",
      dotBlue: "#1CDAE5",
      blueButton: "#ECF8FC",
      blackButton: "#001C25",
      transparentBlue: "rgba(91, 120, 199, 0.21)",
      blackText: "#2e2e2e",
      white: "#FFFFFF",
      black: "#000000",
      grey: "#4e4e4e",
      lightGrey: "#D9D9D9",
      greyText: "rgba(0, 0, 0, 0.44)",
      red: "rgb(239 68 68)",
      green: "rgba(0, 160, 6, 0.77)",
      greyButton: "#ECEEEF",
      fb: "#3b5998",
      google: "#eee",
    },
    extend: {},
  },
  plugins: [],
};
