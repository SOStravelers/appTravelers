import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store";

export default function TravellersDetailsModal({ open, onClose }) {
  const { service, setService, language } = useStore();

  const {
    amount = 1,
    amountChildren = 0,
    price: { category1 = 0, category2 = 0 } = {},
    hasLimit,
    limit,
  } = service || {};

  const [adults, setAdults] = useState(amount);
  const [children, setChildren] = useState(amountChildren);

  // Control de animación y montaje
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const overlayRef = useRef();

  // Animaciones de aparición/desaparición
  useEffect(() => {
    if (open) {
      setMounted(true);
      setAdults(amount);
      setChildren(amountChildren);
      setTimeout(() => setIsVisible(true), 10); // pequeño delay para trigger transición
    } else {
      setIsVisible(false);
      setTimeout(() => setMounted(false), 400); // 400ms = duración tailwind
    }
  }, [open, amount, amountChildren]);

  // Click fuera para cerrar
  useEffect(() => {
    if (!mounted) return;
    const handler = (e) => {
      if (overlayRef.current && overlayRef.current === e.target) onClose();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [mounted, onClose]);

  // Lógica de cantidad
  const incAdults = () => {
    if (hasLimit && adults + children >= limit) return;
    setAdults((a) => a + 1);
  };
  const decAdults = () => {
    if (adults > 1) setAdults((a) => a - 1);
  };
  const incChildren = () => {
    if (hasLimit && adults + children >= limit) return;
    setChildren((c) => c + 1);
  };
  const decChildren = () => {
    if (children > 0) setChildren((c) => c - 1);
  };

  // Labels de precio
  const totalAdults = adults * category1;
  const totalChildren = children * category2;
  const total = totalAdults + totalChildren;
  const unitLabel = `${category1.toFixed(2)} € por adulto`;
  const childrenLabel =
    children > 0
      ? `${category2.toFixed(2)} € por niño${children > 1 ? "s" : ""}`
      : null;

  // Guardar cambios
  const handleApply = () => {
    setService({ ...service, amount: adults, amountChildren: children });
    onClose();
  };

  // No renderizar si no está montado (ni animando)
  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-xl w-full max-w-md p-8 mx-4 relative
          transform transition-all duration-400
          ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }
        `}
        style={{ willChange: "transform" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {language === "es" ? "Detalles y viajeros" : "Details & Travellers"}
        </h3>
        <div className="space-y-6">
          {/* Adultos */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-md font-semibold">
                {language === "es" ? "Adultos" : "Adults"}
              </h4>
              <p className="text-sm text-gray-500">
                {language === "es" ? "Edad: más de 18" : "Age: over 18"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={decAdults}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl"
              >
                –
              </button>
              <span className="w-8 text-center text-lg">{adults}</span>
              <button
                onClick={incAdults}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
          </div>
          {/* Niños */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-md font-semibold">
                {language === "es" ? "Niños" : "Children"}
              </h4>
              <p className="text-sm text-gray-500">
                {language === "es" ? "Edad: 2–12 años" : "Age: 2–12 yrs"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={decChildren}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl"
              >
                –
              </button>
              <span className="w-8 text-center text-lg">{children}</span>
              <button
                onClick={incChildren}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <hr className="my-6" />
        {/* Detalles de precio */}
        <h3 className="text-lg font-semibold mb-2">
          {language === "es" ? "Detalle del precio" : "Price breakdown"}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>{unitLabel}</span>
            <span>{totalAdults.toFixed(2)} €</span>
          </div>
          {childrenLabel && (
            <div className="flex justify-between">
              <span>{childrenLabel}</span>
              <span>{totalChildren.toFixed(2)} €</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between font-semibold">
            <span>{language === "es" ? "Total" : "Total"} EUR</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
        <button
          onClick={handleApply}
          className="block w-full bg-black text-white rounded-full py-3 mt-2 hover:opacity-90 transition"
        >
          {language === "es" ? "Aplicar" : "Apply"}
        </button>
      </div>
    </div>
  );
}
