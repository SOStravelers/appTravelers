import { LogoSosRelleno, LogoSosWhite } from "@/constants/icons";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function LoaderGlobal() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); // <- 💡 importante

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    setMounted(true); // <- solo montar después que estamos en el cliente
  }, []);

  if (!mounted) return null; // <- ❗ Evita el render SSR

  const themeCookie = Cookies.get("theme");
  const isDark =
    themeCookie === "dark" || (themeCookie === "default" && darkMode);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-backgroundP z-50 flex flex-col items-center justify-center transition-opacity duration-300 opacity-100">
      {
        // isDark ?
        // <LogoSosWhite className="w-20 h-20" />
        // :
        <LogoSosRelleno />
      }
      <p className="font-medium mt-4 text-textColor text-xl">SOS Travelers</p>
      <div className="w-12 h-12 mt-3 border-4 border-t-transparent border-textColor rounded-full animate-spin"></div>
    </div>
  );
}
