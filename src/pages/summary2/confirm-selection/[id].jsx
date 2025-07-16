import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import CardSummaryService from "@/components/summary/CardSummaryService";
import CardSummaryService2 from "@/components/summary/CardSummaryService2";
import { useStore } from "@/store";
import {
  formatearFecha,
  formatearFechaCompletaDesdeISO,
  sumarMinutosAISO,
} from "@/utils/format";
import TravellersDetailsModal from "@/components/utils/modal/TravellersDetailsModal";
import languageData from "@/language/newSummary.json";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";

export default function SummaryPage() {
  const router = useRouter();
  const id = router?.query?.id;
  const { service, setService, language, currency } = useStore();
  const { imgUrl, name, date, startTime, endTime, tourData, selectedData } =
    service;

  const thisLanguage = languageData.confirmSelection;
  const [loading, setLoading] = useState(true); // <-- loading flag
  const [expanded, setExpanded] = useState(true);
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
    const startTime = formatearFechaCompletaDesdeISO(
      service.startTime.isoTime,
      language
    );
    const endTime = formatearFechaCompletaDesdeISO(
      sumarMinutosAISO(service.startTime.isoTime, service.duration),
      language
    );
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
    if (service.typeService === "tour") {
      setAdults(selectedData.amountAdults);
      setChildren(selectedData.amountChildren);
      const total = service.selectedData.totalPrice;
      // selectedData.amountAdults * tourData.adultPrice[currency].value +
      // selectedData.amountChildren * tourData.childrenPrice[currency].value;
      setTotal(total);
    } else {
      const total = service.selectedData.totalPrice;
      setTotal(total);
    }
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
      <div
        className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
      >
        <h1 className="text-md text-textColor font-bold mb-3">
          {thisLanguage.title[language]}
        </h1>

        {/* Contendio Tarjeta Summary */}
        <CardSummaryService
          statusExpanded={true}
          modalOptions={true}
          openModal={() => setModalOpen(true)}
        />

        <CardSummaryService2
          statusExpanded={true}
          modalOptions={true}
          openModal={() => setModalOpen(true)}
        />
      </div>
      {/* Modal de detalles  */}
      <TravellersDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* Botón Siguiente Flotante */}
      <BookingPopup
        priceLabel={`${thisLanguage.value[language]} ${formatPrice(
          total,
          currency
        )} `}
        subtext={""}
        tagLine={hasCancel?.isBefore ? thisLanguage.cancel[language] : ""}
        buttonText={thisLanguage.nextButton[language]}
        onAction={() => setPrice()} // <-- abre el modal
      />
    </>
  );
}
