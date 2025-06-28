import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import delay from "@/utils/delayFunction";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import { useStore } from "@/store";
import { formatearFecha } from "@/utils/format";
import TravellersDetailsModal from "@/components/utils/modal/TravellersDetailsModal";
import languageData from "@/language/newSummary.json";
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

  const thisLanguage = languageData.confirmSelection;
  const [loading, setLoading] = useState(true); // <-- loading flag
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

  useEffect(() => {
    setLoading(true);
    delay(250, () => {
      setLoading(false);
    });
  }, []);

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

  function interpolate(str, vars) {
    return str.replace(/\$\{(\w+(\.\w+)*)\}/g, (_, key) => {
      // Permite nested: ej "startTime.stringData"
      return key.split(".").reduce((o, i) => (o ? o[i] : ""), vars);
    });
  }

  return (
    <>
      <div
        className={`min-h-screen bg-gray-50 p-4 flex flex-col items-center
          transform transition-all duration-800 ease-out
          transition-opacity duration-800 ease-out
          ${
            loading
              ? "opacity-0 scale-95 translate-y-4 pointer-events-none"
              : "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          }
        `}
      >
        <div className="h-12 md:h-20"></div>
        <h1 className="text-md font-bold mb-1">
          {thisLanguage.title[language]}
        </h1>

        <div className="bg-white rounded-xl shadow w-full max-w-md overflow-hidden">
          {/* HEADER */}
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {/* Contenido principal */}
            <div className="flex items-center flex-1">
              <img
                src={imgUrl}
                alt=""
                className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
              />
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold flex-1 line-clamp-2">
                  {name?.[language] || ""}
                </h2>
                <p className="text-gray-700 text-xs">
                  {thisLanguage.value[language]} {total.toFixed(2)} € EUR
                </p>
                <p className="text-gray-700 text-xs">
                  {thisLanguage.payNow[language]} {total.toFixed(2)} € EUR
                </p>
              </div>
            </div>
            {/* Icono flecha */}
            <div className="flex-shrink-0 ml-2">
              <svg
                className={`w-4 h-4 transform transition-transform ${
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
          </div>

          {/* CONTENIDO */}
          <div
            className={`px-4 pb-4 space-y-4 transition-max-h duration-300 overflow-hidden ${
              expanded ? "max-h-screen" : "max-h-0"
            }`}
          >
            {expanded && <hr />}
            {!expanded && <div className="mt-5" />}

            {/* Fecha */}
            <div className="space-y-1">
              <p className="font-semibold text-sm">
                {thisLanguage.sections.date.title[language]}
              </p>
              <p className="text-gray-700 text-xs">{displayDate}</p>
              <p className="text-gray-700 text-xs">
                {thisLanguage.sections.date.from[language]}{" "}
                {startTime?.stringData || ""}{" "}
                {thisLanguage.sections.date.to[language]}{" "}
                {endTime?.stringData || ""}
              </p>
            </div>
            {/* Viajeros */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  {thisLanguage.sections.travellers.title[language]}
                </p>
                <p className="text-gray-700 text-xs">
                  {adults} {thisLanguage.sections.travellers.adults[language]}
                  {children > 0 &&
                    `, ${children} ${thisLanguage.sections.travellers.children[language]}`}
                </p>
              </div>
              <button
                className="text-blueBorder font-semibold text-xs hover:underline"
                onClick={() => setModalOpen(true)}
              >
                {thisLanguage.sections.travellers.changeButton[language]}
              </button>
            </div>
            {/* Precio total */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  {thisLanguage.sections.totalPrice.title[language]}
                </p>
                <p className="text-gray-700 text-xs">
                  {total.toFixed(2)} € EUR
                </p>
              </div>
              <button
                className="text-blueBorder font-semibold hover:underline text-xs"
                onClick={() => setModalOpen(true)}
              >
                {thisLanguage.sections.totalPrice.detailsButton[language]}
              </button>
            </div>
            {/* Cancelación gratuita */}
            <div className="space-y-1">
              <p className="font-semibold text-green-600 text-sm">
                {thisLanguage.sections.booking.title[language]}
              </p>
              <p className="text-gray-700 text-xs">
                {interpolate(thisLanguage.sections.booking.subtitle[language], {
                  displayDate,
                  startTime,
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-green-600 text-sm">
                {thisLanguage.sections.freeCancelation.title[language]}
              </p>
              <p className="text-gray-700 text-xs">
                {interpolate(
                  thisLanguage.sections.freeCancelation.subtitle[language],
                  {
                    displayDate,
                    startTime,
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Botón Siguiente Flotante */}
      <BookingPopup
        priceLabel={`${thisLanguage.value[language]} ${total.toFixed(2)} € EUR`}
        subtext={""}
        tagLine={thisLanguage.cancel[language]}
        buttonText={thisLanguage.nextButton[language]}
        onAction={() => router.push(`/summary2/contact-info/${id}`)} // <-- abre el modal
      />
      {/* Modal de detalles  */}
      <TravellersDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
