import localFont from "next/font/local";

export const mazzard = localFont({
  src: [
    {
      path: "../../public/fonts/mazzard-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/mazzard-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/mazzard-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/mazzard-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  subsets: ["latin"],
  display: "swap",
});
