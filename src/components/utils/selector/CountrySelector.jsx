import { useEffect, useState } from "react";
import Select from "react-select";
import countries from "@/utils/countriesFull.json";
import languageData from "@/language/newSummary.json";

// Estilos personalizados para react-select
const selectStyles = (error) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-input)",
    color: "var(--color-text-color)",
    borderRadius: "6px",
    borderColor: error ? "#f87171" : state.isFocused ? "#00A0D5" : "#ccc",
    boxShadow: "none",
    minHeight: 42,
    fontSize: 14,
    transition: "all 0.2s",
    "&:hover": {
      borderColor: "#00A0D5",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text-color)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-text-color)",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--color-text-gray)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-input)",
    borderRadius: "10px",
    marginTop: 4,
    zIndex: 40,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#00A0D5"
      : state.isFocused
      ? "rgba(0, 119, 182, 0.2)"
      : "transparent",
    color: state.isSelected ? "#fff" : "var(--color-text-color)",
    display: "flex",
    gap: "0.5rem",
    fontSize: 14,
    cursor: "pointer",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#00A0D5" : "#999",
    "&:hover": {
      color: "#00A0D5",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
});

export default function CountrySelector({
  language,
  country,
  setCountry,
  setPhoneCode,
  setError: setErrCountry,
  error,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch && window.innerWidth < 768); // puedes ajustar el breakpoint si quieres
    }
  }, []);

  const options = countries.map((c) => ({
    value: c.code,
    label: `${c.emoji ? c.emoji + " " : ""}${c.name[language] || c.name.en}`,
    dialCode: c.dial_code,
  }));

  const currentOption = options.find((o) =>
    country ? o.label.includes(country) : false
  );

  return (
    <div className="w-full max-w-md my-1">
      <label className="block text-xs font-medium mb-2 text-textColor">
        {languageData.contactInfo.countryInput.title[language]}
      </label>

      <Select
        placeholder="Seleccionar"
        options={options}
        value={currentOption || null}
        onChange={(opt) => {
          const name = opt.label.replace(/^[^\p{L}\p{N}]+/u, "");
          setCountry(name);
          setPhoneCode(opt.dialCode);
          if (error) setErrCountry(null);
        }}
        styles={selectStyles(error)}
        isSearchable={!isMobile} // ❌ desactiva búsqueda en móviles
        openMenuOnFocus={!isMobile} // ❌ evita abrir el teclado en móviles
        menuShouldScrollIntoView={false}
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
