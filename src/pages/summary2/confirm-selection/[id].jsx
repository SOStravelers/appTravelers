import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import { useStore } from "@/store";
import { formatearFecha } from "@/utils/format";
import TravellersDetailsModal from "@/components/utils/modal/TravellersDetailsModal";
export default function SummaryPage() {
  const router = useRouter();
  const id = router?.query?.id;
  const { service, setService, language } = useStore();
  const {
    imgUrl,
    name,
    date,
    startTime,
    endTime,
    amount = 1,
    amountChildren = 0,
    price: { category1 = 0, category2 = 0 } = {},
    hasLimit,
    limit,
  } = service;

  const [expanded, setExpanded] = useState(true);

  // NUEVO: doble estado
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [adults, setAdults] = useState(amount);
  const [children, setChildren] = useState(amountChildren);
  const overlayRef = useRef();

  // Para cerrar: desactivar animación y desmontar cuando termine
  const closeModal = () => setIsVisible(false);

  // Click fuera para cerrar
  useEffect(() => {
    const handler = (e) => {
      if (overlayRef.current && overlayRef.current === e.target) closeModal();
    };
    if (isMounted) window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [isMounted]);

  // PRECIOS
  const totalAdults = adults * category1;
  const totalChildren = children * category2;
  const total = totalAdults + totalChildren;

  // Fecha/hora
  const displayDate = formatearFecha?.(date, language) || "";
  const timeLabel = `${startTime?.stringData || ""} – ${
    endTime?.stringData || ""
  }`;

  return (
    <div className="min-h-screen bg-gray-50 p-4  flex flex-col items-center">
      <div className="h-12"></div>
      <h1 className="text-md font-bold mb-1">
        {language === "es" ? "Verificar y continuar" : "Review & continue"}
      </h1>

      <div className="bg-white rounded-xl shadow w-full max-w-md overflow-hidden">
        {/* HEADER */}
        <div
          className="flex items-center p-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <img
            src={imgUrl}
            alt=""
            className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
          />
          <div className=" flex flex-col ">
            <h2 className="text-sm font-semibold flex-1 line-clamp-2">
              {name?.[language] || ""}
            </h2>
            <p className="text-gray-700 text-xs">
              Valor: {total.toFixed(2)} € EUR
            </p>
            <p className="text-gray-700 text-xs">
              Pagarás ahora: {total.toFixed(2)} € EUR
            </p>
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* CONTENIDO */}
        <div
          className={`px-4 pb-4 space-y-4 transition-max-h duration-300 overflow-hidden ${
            expanded ? "max-h-screen" : "max-h-0"
          }`}
        >
          <hr />
          {/* Fecha */}
          <div className="space-y-1">
            <p className="font-semibold text-sm">
              {language === "es" ? "Fecha" : "Date"}
            </p>
            <p className="text-gray-700 text-xs">{displayDate}</p>
            <p className="text-gray-700 text-xs">
              {language === "es" ? "De" : "From"} {startTime?.stringData || ""}{" "}
              {language === "es" ? "a" : "to"} {endTime?.stringData || ""}
            </p>
          </div>
          {/* Viajeros */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-sm">
                {language === "es" ? "Viajeros" : "Travellers"}
              </p>
              <p className="text-gray-700 text-xs">
                {adults} {language === "es" ? "adultos" : "adults"}
                {children > 0 &&
                  `, ${children} ${
                    language === "es" ? "niño(s)" : "child(ren)"
                  }`}
              </p>
            </div>
            <button
              className="text-blueBorder font-semibold text-xs hover:underline"
              onClick={() => setModalOpen(true)}
            >
              {language === "es" ? "Cambiar" : "Change"}
            </button>
          </div>
          {/* Precio total */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-sm">
                {language === "es" ? "Precio total" : "Total price"}
              </p>
              <p className="text-gray-700 text-xs">{total.toFixed(2)} € EUR</p>
            </div>
            <button
              className="text-blueBorder font-semibold hover:underline text-xs"
              onClick={() => setModalOpen(true)}
            >
              {language === "es" ? "Detalles" : "Details"}
            </button>
          </div>
          {/* Cancelación gratuita */}
          <div className="space-y-1">
            <p className="font-semibold text-green-600 text-sm">
              Agenda ahora paga despues
            </p>
            <p className="text-gray-700 text-xs">
              {language === "es"
                ? `Si cancelas antes del ${displayDate} a las ${startTime?.stringData}, recibirás un reembolso completo.`
                : `If you cancel before ${displayDate} at ${startTime?.stringData}, you’ll get a full refund.`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-green-600 text-sm">
              {language === "es" ? "Cancelación gratuita" : "Free cancellation"}
            </p>
            <p className="text-gray-700 text-xs">
              {language === "es"
                ? `Si cancelas antes del ${displayDate} a las ${startTime?.stringData}, recibirás un reembolso completo.`
                : `If you cancel before ${displayDate} at ${startTime?.stringData}, you’ll get a full refund.`}
            </p>
          </div>
        </div>
      </div>

      {/* Botón Siguiente */}

      <BookingPopup
        priceLabel={`wena`}
        subtext={"hola"}
        tagLine={"chao"}
        buttonText={"Next"}
        onAction={() => router.push(`/summary2/contact-info/${id}`)} // <-- abre el modal
      />
      {/* <button
        onClick={() => router.push(`/summary2/contact-info/${id}`)}
        className="block w-1/2 mx-auto bg-black text-white rounded-full py-2 text-sm mt-2 hover:opacity-90 transition"
      >
        {language === "es" ? "Siguiente" : "Next"}
      </button> */}

      {/* MODAL - doble estado y transición más suave */}

      <TravellersDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
