// components/utils/LanguageSelector.jsx
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import "flag-icons/css/flag-icons.min.css";

const FLAGS = {
  es: "es", // 🇪🇸
  en: "gb", // 🇬🇧
  pt: "br", // 🇵🇹
  fr: "fr", // 🇫🇷
  de: "de", // 🇩🇪
};

const LanguageSelector = () => {
  const { language, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  /* click-fuera ⇒ cerrar */
  useEffect(() => {
    const close = (e) => !wrapper.current?.contains(e.target) && setOpen(false);
    addEventListener("mousedown", close);
    return () => removeEventListener("mousedown", close);
  }, []);

  const changeLang = (code) => {
    setLanguage(code);
    Cookies.set("language", code, { sameSite: "lax", expires: 365 });
    setOpen(false);
  };

  return (
    <div ref={wrapper} className="relative">
      {/* ─── Botón principal ─── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-7 h-6 rounded
                   ring-1 ring-white/40 hover:ring-white transition"
        aria-label="Change language"
      >
        <span className={`fi fi-${FLAGS[language] ?? "gb"} fis text-lg`} />
      </button>

      {/* ─── Pop-over ─── */}
      {open && (
        <div
          className="absolute right-0 mt-2 flex flex-col gap-1
                     p-2 bg-white shadow-lg rounded-lg ring-1 ring-black/10 z-50"
        >
          {Object.entries(FLAGS)
            .filter(([code]) => code !== language)
            .map(([code, iso]) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className="flex items-center justify-center w-7 h-6 rounded
                           hover:bg-gray-100 transition"
                aria-label={code}
              >
                <span className={`fi fi-${iso} fis text-lg`} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
