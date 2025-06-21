// components/utils/LanguageSelector.jsx
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import "flag-icons/css/flag-icons.min.css";

/** Mapea tu código de idioma ⇢ código ISO-2 que usa flag-icons */
const FLAGS = {
  es: "es", // 🇪🇸
  en: "gb", // 🇬🇧
  pt: "pt", // 🇵🇹
  fr: "fr", // 🇫🇷
  de: "de", // 🇩🇪
};

const LanguageSelector = () => {
  const { language, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  /* Cerrar pop-over si se hace click fuera */
  useEffect(() => {
    const close = (e) => !wrapper.current?.contains(e.target) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const changeLang = (code) => {
    setLanguage(code);
    Cookies.set("language", code, { sameSite: "lax", expires: 365 });
    setOpen(false);
  };

  return (
    <div ref={wrapper} className="relative">
      {/* ───── Botón con la bandera activa ───── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-8 h-6 rounded
                   ring-1 ring-white/40 hover:ring-white transition"
        aria-label="Change language"
      >
        <span className={`fi fi-${FLAGS[language] ?? "gb"} fis`} />
      </button>

      {/* ───── Pop-over con el resto de idiomas ───── */}
      {open && (
        <div
          className="absolute right-0 mt-1 flex flex-col overflow-hidden
                     rounded-lg bg-white shadow-lg ring-1 ring-black/10 z-50"
        >
          {Object.entries(FLAGS)
            .filter(([code]) => code !== language)
            .map(([code, iso]) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className="p-1 hover:bg-gray-100"
                aria-label={code}
              >
                <span className={`fi fi-${iso} fis`} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
