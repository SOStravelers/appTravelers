import React from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import { FiRefreshCw, FiHome, FiSun } from "react-icons/fi";
import { FaUmbrellaBeach } from "react-icons/fa";
import { GiPalmTree } from "react-icons/gi";

/**
 * Panel simpático de error “modo vacaciones”.
 *
 * Props:
 * - onRetry?: () => void              -> acción al reintentar (opcional)
 * - onHome?: () => void               -> acción al ir al inicio (opcional)
 * - homePath?: string                 -> ruta fallback si no hay historial (default: '/service-history')
 * - className?: string                -> clases extra para el contenedor
 */
export default function VacationErrorPanel({
  onRetry,
  onHome,
  homePath = "/",
  className = "",
}) {
  const { language } = useStore();
  const router = useRouter();

  // Textos internos (no hace falta pasarlos desde la página)
  const dict = {
    es: {
      title: "¡Ups! Esta página se fue de vacaciones",
      desc: "Parece que tu reserva se quedó tomando sol. Podés intentar de nuevo o volver al inicio.",
      retry: "Reintentar",
      home: "Ir al inicio",
    },
    en: {
      title: "Oops! This page went on vacation",
      desc: "Looks like your booking is relaxing at the beach. Try again or go back home.",
      retry: "Retry",
      home: "Go home",
    },
    pt: {
      title: "Opa! Esta página foi tirar férias",
      desc: "Parece que sua reserva ficou pegando sol. Tente novamente ou volte ao início.",
      retry: "Tentar novamente",
      home: "Ir ao início",
    },
    fr: {
      title: "Oups ! Cette page est partie en vacances",
      desc: "On dirait que votre réservation bronze au soleil. Réessayez ou retournez à l’accueil.",
      retry: "Réessayer",
      home: "Accueil",
    },
    de: {
      title: "Ups! Diese Seite ist im Urlaub",
      desc: "Deine Buchung macht wohl Strandurlaub. Versuch’s erneut oder zurück zur Startseite.",
      retry: "Erneut versuchen",
      home: "Startseite",
    },
  };

  const t = dict[language] || dict.en;

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  const handleHome = () => {
    // if (onHome) return onHome();
    // // fallback inteligente: si hay historial, volver; si no, ir a homePath
    // if (typeof window !== "undefined" && window.history.length > 1) {
    //   router.back();
    // } else {
    router.push(homePath);
    // }
  };

  return (
    <div
      className={
        "w-full max-w-2xl bg-backgroundModal  rounded-2xl p-6 " +
        "  text-center shadow-sm " +
        className
      }
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-4 mb-3">
        <FiSun className="text-textColor " size={40} />
        <FaUmbrellaBeach
          className="text-textColor  hover:rotate-6 "
          size={48}
          title="Beach time!"
        />
        <GiPalmTree className="text-textColor" size={40} />
      </div>

      <h2 className="text-textColor font-semibold text-lg">{t.title}</h2>
      <p className="text-textColorGray text-sm max-w-md mx-auto mt-1">
        {t.desc}
      </p>

      <div className="flex justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-textColor hover:bg-primary hover:text-white transition-colors"
        >
          <FiRefreshCw aria-hidden />
          {t.retry}
        </button>
        <button
          type="button"
          onClick={handleHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-textColor hover:bg-gray-100 transition-colors"
        >
          <FiHome aria-hidden />
          {t.home}
        </button>
      </div>
    </div>
  );
}
