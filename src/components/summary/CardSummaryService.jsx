import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { useStore } from "@/store";
import {
  formatearFechaCompletaDesdeISO,
  sumarMinutosAISO,
} from "@/utils/format";
import TravellersDetailsModal from "@/components/utils/modal/TravellersDetailsModal";
import languageData from "@/language/newSummary.json";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";

export default function CardSummaryService({
  statusExpanded,
  modalOptions,
  openModal = () => {},
}) {
  const router = useRouter();
  const id = router?.query?.id;
  const { service, setService, language, currency } = useStore();
  const { imgUrl, name, date, startTime, endTime, tourData, selectedData } =
    service;

  const thisLanguage = languageData.confirmSelection;
  const [loading, setLoading] = useState(true); // <-- loading flag
  const [expanded, setExpanded] = useState(false);
  const [hasCancel, setHasCancel] = useState(false);

  // NUEVO: doble estado
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState({});
  const [endDate, setEndtDate] = useState({});

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [total, setTotal] = useState(0);
  const overlayRef = useRef();

  // Para cerrar: desactivar animación y desmontar cuando termine
  const closeModal = () => setIsVisible(false);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    setExpanded(statusExpanded);
  }, []);

  useEffect(() => {
    if (service.canCancel) {
      const hasCancel = isBeforeHoursThreshold(
        service.startTime.isoTime,
        service.timeUntilCancel
      );
      setHasCancel(hasCancel);
    } else {
      setHasCancel(false);
    }
  }, [service]);

  useEffect(() => {
    setStartDate(startTime);
    setEndtDate(endTime);
  }, []);

  // Click fuera para cerrar
  useEffect(() => {
    const handler = (e) => {
      if (overlayRef.current && overlayRef.current === e.target) closeModal();
    };
    if (isMounted) window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [isMounted]);

  useEffect(() => {
    setAdults(selectedData.amountAdults);
    setChildren(selectedData.amountChildren);
    const total =
      selectedData.amountAdults * tourData.adultPrice[currency] +
      selectedData.amountChildren * tourData.childrenPrice[currency];
    setTotal(total);
  }, [service]);

  function interpolate(str, vars) {
    return str.replace(/\$\{(\w+(\.\w+)*)\}/g, (_, key) => {
      // Permite nested: ej "startTime.stringData"
      return key.split(".").reduce((o, i) => (o ? o[i] : ""), vars);
    });
  }

  const setPrice = () => {
    setService({ ...service, total: 10 });
    router.push(`/summary2/contact-info/${id}`);
  };

  return (
    <>
      <div className="bg-backgroundCard rounded-xl mt-2 shadow w-full max-w-xl overflow-hidden">
        {/* HEADER */}
        <div
          className="flex items-center justify-between mt-2  p-3 cursor-pointer"
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
              <h2 className="text-sm text-textColor font-semibold flex-1 line-clamp-2">
                {name?.[language] || ""}
              </h2>
              <p className="text-textColor text-xs">
                {thisLanguage.value[language]}{" "}
                {formatPrice(selectedData.totalPrice, currency)}
              </p>
              {hasCancel?.isBefore && (
                <p className="text-textColor text-xs">
                  {thisLanguage.payNow[language]} {formatPrice(0, currency)}
                </p>
              )}
            </div>
          </div>
          {/* Icono flecha */}
          <div className="flex-shrink-0 ml-2">
            <svg
              className={`w-5 h-5 transform transition-transform text-[var(--color-text-gray)] ${
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
            <p className="font-semibold text-textColor text-sm">
              {thisLanguage.sections.date.title[language]}
            </p>
            <p className="text-textColorGray text-xs">{startDate?.data}</p>
            <p className="text-textColorGray text-xs">
              {thisLanguage.sections.date.from[language]}{" "}
              {startDate?.stringData || ""}{" "}
              {thisLanguage.sections.date.to[language]}{" "}
              {endDate?.stringData || ""}
            </p>
          </div>
          {/* Viajeros */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-textColor text-sm">
                {thisLanguage.sections.travellers.title[language]}
              </p>
              <p className="text-textColorGray text-xs">
                {adults} {thisLanguage.sections.travellers.adults[language]}
                {children > 0 &&
                  `, ${children} ${thisLanguage.sections.travellers.children[language]}`}
              </p>
            </div>
            {modalOptions && (
              <button
                className="text-blueBorder font-semibold text-xs hover:underline"
                onClick={() => openModal(true)}
              >
                {thisLanguage.sections.travellers.changeButton[language]}
              </button>
            )}
          </div>
          {/* Precio total */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold  text-textColor text-sm">
                {thisLanguage.sections.totalPrice.title[language]}
              </p>
              <p className="text-textColorGray text-xs">
                {formatPrice(total, currency)}
              </p>
            </div>
            {modalOptions && (
              <button
                className="text-blueBorder font-semibold hover:underline text-xs"
                onClick={() => openModal(true)}
              >
                {thisLanguage.sections.totalPrice.detailsButton[language]}
              </button>
            )}
          </div>
          {/* Cancelación gratuita */}
          {hasCancel?.isBefore && (
            <>
              <div className="space-y-1">
                <p className="font-semibold text-textColorGreen text-sm">
                  {thisLanguage.sections.booking.title[language]}
                </p>
                <p className="text-textColorGray text-xs">
                  {interpolate(
                    thisLanguage.sections.booking.subtitle[language],
                    {
                      displayDate: hasCancel?.cancelTime?.data,
                      startTime: {
                        stringData: hasCancel?.cancelTime?.stringData,
                      },
                    }
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-textColorGreen text-sm">
                  {thisLanguage.sections.freeCancelation.title[language]}
                </p>
                <p className="text-textColorGray text-xs">
                  {interpolate(
                    thisLanguage.sections.freeCancelation.subtitle[language],
                    {
                      displayDate: hasCancel?.cancelTime?.data,
                      startTime: {
                        stringData: hasCancel?.cancelTime?.stringData,
                      },
                    }
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
