import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store";
import { formatPrice } from "@/utils/format";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
export default function TravellersDetailsModal({ open, onClose }) {
  const { service, setService, language, currency } = useStore();

  const { tourData, selectedData } = service || {};

  const [adults, setAdults] = useState(0);
  const [totalAdults, setTotalAdults] = useState(5);
  const [children, setChildren] = useState(6);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalAmount, setTotalAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Control de animación y montaje
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef();

  function setPrices() {
    const totalA = adults * tourData.adultPrice[currency].value;
    const totalC = children * tourData.childrenPrice[currency].value;
    const total = totalA + totalC;
    setTotalAdults(totalA);
    setTotalChildren(totalC);
    setTotalPrice(total);
  }

  useEffect(() => {
    setPrices();
  }, [adults, children]);

  // Animaciones de aparición/desaparición
  useEffect(() => {
    if (open) {
      setMounted(true);
      setAdults(selectedData.amountAdults);
      setChildren(selectedData.amountChildren);
      setTotalAmount(selectedData.totalAmount);
      setTimeout(() => setIsVisible(true), 10); // pequeño delay para trigger transición
    } else {
      setIsVisible(false);
      setTimeout(() => setMounted(false), 400); // 400ms = duración tailwind
    }
  }, [open]);

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
    if (
      service?.tourData?.hasLimit &&
      service?.tourData?.limit &&
      totalAmount >= service?.tourData?.limit
    )
      return;
    const v = adults + 1;
    setAdults(v);
    setTotalAmount(v + children);
  };
  const decAdults = () => {
    if (adults > 1) {
      const v = adults - 1;
      setAdults(v);
      setTotalAmount(v + children);
    }
  };
  // adjust children count
  const incChildren = () => {
    if (
      service?.tourData?.hasLimit &&
      service?.tourData?.limit &&
      totalAmount >= service?.tourData?.limit
    )
      return;
    const v = children + 1;
    setChildren(v);
    setTotalAmount(v + adults);
  };
  const decChildren = () => {
    if (children > 0) {
      const v = children - 1;
      setChildren(v);
      setTotalAmount(v + adults);
    }
  };

  // Labels de precio
  const unitLabel = `${tourData.adultPrice[currency].value} € por adulto`;
  const childrenLabel =
    children > 0
      ? `${tourData.childrenPrice[currency].value} € por niño${
          children > 1 ? "s" : ""
        }`
      : null;

  // Guardar cambios
  const handleApply = () => {
    setService({
      ...service,
      selectedData: {
        amountAdults: adults,
        amountChildren: children,
        totalAdult: totalAdults,
        totalChildren: totalChildren,
        totalAmount: totalAmount,
        totalPrice: totalPrice,
      },
    });
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
          bg-backgroundModal rounded-xl w-full max-w-md p-8 mx-4 relative
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
          className="absolute top-4 right-4 text-textColorGray text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-sm text-textColor font-semibold mb-4">
          {language === "es" ? "Detalles y viajeros" : "Details & Travellers"}
        </h3>
        <div className="space-y-6">
          {/* Adultos */}
          <div className="flex justify-between  items-center">
            <div>
              <h4 className=" font-semibold text-textColor text-sm">
                {language === "es" ? "Adultos" : "Adults"}
              </h4>
              <p className="text-xs text-textColorGray">
                {language === "es" ? "Edad: más de 18" : "Age: over 18"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={decAdults}
                className="w-6 h-6 rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-textColor">–</p>
              </button>
              <span className="w-8 text-center text-textColor text-sm">
                {adults}
              </span>
              <button
                onClick={incAdults}
                className="w-6 h-6 rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-sm text-textColor">+</p>
              </button>
            </div>
          </div>
          {/* Niños */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-textColor font-semibold text-sm">
                {language === "es" ? "Niños" : "Children"}
              </h4>
              <p className="text-sm text-textColorGray text-xs">
                {language === "es" ? "Edad: 2–12 años" : "Age: 2–12 yrs"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={decChildren}
                className="w-6 h-6 rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-sm text-textColor">-</p>
              </button>
              <span className="w-8 text-center text-textColor text-sm">
                {children}
              </span>
              <button
                onClick={incChildren}
                className="w-6 h-6  rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-sm text-textColor">+</p>
              </button>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        {/* Detalles de precio */}
        <h3 className="text-sm text-textColor font-semibold mb-2">
          {language === "es" ? "Detalle del precio" : "Price breakdown"}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-textColorGray text-sm">
            <span>{unitLabel}</span>
            <span>{formatPrice(totalAdults, currency)}</span>
          </div>
          {childrenLabel ? (
            <div className="flex justify-between text-textColorGray text-sm">
              <span>{childrenLabel}</span>
              <span>{formatPrice(totalChildren, currency)}</span>
            </div>
          ) : (
            <div className="flex justify-between h-5 text-sm"></div>
          )}
          <hr />
          <div className="flex justify-between  text-textColor font-semibold text-sm">
            <span>{language === "es" ? "Total" : "Total"} EUR</span>
            <span>{formatPrice(totalPrice, currency)}</span>
          </div>
        </div>

        <OutlinedButton
          onClick={handleApply}
          text={language === "es" ? "Aplicar" : "Apply"}
          px={0}
          py={2}
          dark="darkHeavy"
          textSize="text-xs"
          textColor="text-white"
          buttonCenter={true}
        />
      </div>
    </div>
  );
}
