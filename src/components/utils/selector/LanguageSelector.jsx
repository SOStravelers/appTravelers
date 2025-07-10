// components/utils/LanguageSelector.jsx
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import "flag-icons/css/flag-icons.min.css";

const FLAGS = {
  es: "es", // España
  en: "us", // Estados Unidos
  pt: "br", // Brasil
  fr: "fr", // Francia
  de: "de", // Alemania
};

const LanguageSelector = ({ scrolledPastVh }) => {
  const { language, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  // Cierra el dropdown al hacer click fuera
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
      {/* Botón principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 w-16 h-8 rounded ring-1 ring-white/40 hover:ring-white transition"
        aria-label="Change language"
      >
        {/* <span className={`fi fi-${FLAGS[language]} fis text-lg`} /> */}
        <span className="text-xs font-semibold text-white uppercase">
          {language}
        </span>
      </button>

      {/* Pop-over */}
      {open && (
        <div
          className="absolute border  bg-backgroundNavbar right-0 mt-2 flex flex-col gap-1
                     py-2 px-2  shadow-lg rounded-lg ring-1 ring-black/10 z-50"
        >
          {Object.entries(FLAGS)
            .filter(([code]) => code !== language)
            .map(([code, iso]) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className="flex items-center  bg-backgroundNavbar gap-2 w-12 h-8 rounded hover:bg-gray-500  transition"
                aria-label={code}
              >
                <span className={`fi fi-${iso} fis text-lg`} />
                <span className="text-xs text-textColor  uppercase">
                  {code}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
