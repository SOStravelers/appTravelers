// components/CountrySelector.jsx
import { useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import countries from "@/utils/countries.json";

export default function CountrySelector({
  language,
  country,
  setCountry,
  dropdownOpen,
  setDropdownOpen,
  inputClass,
  error,
}) {
  const countryRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={countryRef} className="relative">
      <label className="block text-xs font-medium mb-2">
        {language === "es"
          ? "País"
          : language === "pt"
          ? "País"
          : language === "fr"
          ? "Pays"
          : language === "de"
          ? "Land"
          : "Country"}
      </label>
      <div
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={`relative ${inputClass} cursor-pointer flex items-center justify-between`}
      >
        <span>{country || "Seleccionar"}</span>
        <FaChevronDown className="text-xs" />
      </div>
      {dropdownOpen && (
        <div className="absolute z-20 w-full max-h-60 overflow-auto mt-1 bg-white border border-gray-300 rounded-md shadow">
          {countries.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setCountry(c.name[language] || c.name.en);
                setDropdownOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <span>{c.emoji}</span>
              <span>{c.name[language] || c.name.en}</span>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
