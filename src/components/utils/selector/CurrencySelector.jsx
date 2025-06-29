// components/utils/CurrencySelector.jsx
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/store";

const CURRENCIES = {
  BRL: { symbol: "R$", label: "BRL" },
  USD: { symbol: "$", label: "USD" },
  EUR: { symbol: "€", label: "EUR" },
};

const CurrencySelector = ({ scrolledPastVh }) => {
  const { currency, setCurrency } = useStore();
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const close = (e) => !wrapper.current?.contains(e.target) && setOpen(false);
    addEventListener("mousedown", close);
    return () => removeEventListener("mousedown", close);
  }, []);

  const changeCurrency = (code) => {
    setCurrency(code);
    Cookies.set("currency", code, { sameSite: "lax", expires: 365 });
    setOpen(false);
  };

  return (
    <div ref={wrapper} className="relative mx-2">
      {/* Botón principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 w-16 h-8 rounded ring-1 ring-white/40 hover:ring-white transition"
      >
        <span className="text-xs font-bold text-white">
          {CURRENCIES[currency]?.symbol}
        </span>
        <span className="text-xs font-semibold text-white uppercase">
          {CURRENCIES[currency]?.label}
        </span>
      </button>

      {/* Pop-over */}
      {open && (
        <div
          className="absolute right-0 mt-2 flex flex-col gap-1
                     p-2 bg-white shadow-lg rounded-lg ring-1 ring-black/10 z-50"
        >
          {Object.entries(CURRENCIES)
            .filter(([code]) => code !== currency)
            .map(([code, { symbol, label }]) => (
              <button
                key={code}
                onClick={() => changeCurrency(code)}
                className="flex items-center justify-between w-16 h-8 rounded hover:bg-gray-100 transition px-2"
                aria-label={label}
              >
                <span className="text-sm font-bold">{symbol}</span>
                <span className="text-xs uppercase">{label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
