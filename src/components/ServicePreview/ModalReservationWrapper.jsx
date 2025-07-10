import { useState, useEffect } from "react";
import Calendar from "@/components/utils/calendar/Calendar";
import { useRouter } from "next/router";
import { AlertIcon } from "@/constants/icons";
import languageData from "@/language/reservation.json";
import { useStore } from "@/store";

export default function ModalReservationWrapper({ isOpen, onClose }) {
  const router = useRouter();
  const { language } = useStore();

  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Montar con animación
  useEffect(() => {
    let timeout;

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden"; // 🚫 bloquear scroll

      timeout = setTimeout(() => {
        setAnimateIn(true);
      }, 10); // activar animación entrada
    } else {
      setAnimateIn(false);
      timeout = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = ""; // ✅ restaurar scroll
      }, 300); // debe coincidir con duración de animación
    }

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = ""; // precaución al desmontar
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 transition-opacity duration-300 ${
        animateIn
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-backgroundModal w-full max-w-3xl rounded-lg p-4 transform transition-all duration-300 ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* 🔔 Encabezado */}

        {/* 📅 Calendario */}
        <Calendar id={router?.query?.id} />
      </div>
    </div>
  );
}
