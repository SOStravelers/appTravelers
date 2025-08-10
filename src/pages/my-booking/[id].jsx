import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import BookingService from "@/services/BookingService";
import languageData from "@/language/bookingDetails.json";
import { isBeforeHoursThreshold } from "@/utils/format";
import OrderModal from "@/components/utils/modal/OrderModal";
import PurchaseDetail from "@/pages/purchase/PurchaseDetail";
import ConfirmModalClient from "@/components/utils/modal/ConfirmModalClient";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { alertError } from "@/utils/alerts.jsx";
import VacationErrorPanel from "@/components/utils/error/VacationErrorPanel";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";

export default function MyBooking() {
  const { language } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);
  const getBooking = useCallback(async () => {
    if (!router.isReady) return;
    try {
      setError(null);
      const id = router.query.id;
      if (!id) return;

      const response = await BookingService.getMyBooking(id);
      const booking = response.data;
      setBooking(booking);

      const timeUntilCancel = booking.timeUntilCancel || 0;
      const cancelData = isBeforeHoursThreshold(
        booking.startTime.isoTime,
        timeUntilCancel,
        language
      );
      cancelData.paymentStatus = booking.paymentStatus;
      // Ajustes previos que usabas:
      cancelData.paymentStatus = "unpaid";
      cancelData.isBefore = true;

      setPaymentData(cancelData);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "fetch_failed");
      // opcional: toast
      alertError({ message: "No se pudo cargar la reserva" });
    }
  }, [router.isReady, router.query.id, language]);
  useEffect(() => {
    getBooking();
  }, [getBooking]);
  // Cancela el booking
  const cancelBooking = async () => {
    try {
      const response = await BookingService.cancelById(router.query.id);
      if (response && response.data) {
        setBooking({ ...booking, status: "canceled" });
      }
      setOpenConfirmModal(false);
    } catch (err) {
      if (err.status == 500) {
        alertError({ message: "Error to change, try later" });
      } else {
        alertError({ message: err.response?.data?.error || "Error" });
      }
    }
  };

  return (
    <>
      <div
        className={`min-h-screen px-4 ${
          error ? "mb-0" : "mb-32"
        } flex items-center justify-center bg-backgroundP
      ${loading ? opacityAnimation : displayAnimation}`}
      >
        {error ? (
          <>
            {/* fondo suave opcional */}

            {/* panel centrado, por encima de navbar/topbar */}
            <div className="fixed inset-0 bg-backgroundP  flex items-center justify-center p-4">
              <VacationErrorPanel onRetry={getBooking} />
            </div>
          </>
        ) : (
          // Tu card normal cuando NO hay error
          <div className="bg-backgroundS shadow-md rounded-2xl px-2 flex flex-col items-center py-8 max-w-3xl w-full">
            {/* Encabezado */}
            <div className="flex flex-row align-center justify-center mb-3 w-full max-w-2xl">
              <h1 className="text-lg mr-2 text-textColor">
                {languageData.bookingNumber[language]}:
              </h1>
              <p className="text-textColorGray text-lg">
                {booking?.purchaseOrder || "-"}
              </p>
            </div>

            {/* Tarjeta del evento */}
            {booking && (
              <>
                <EventCard
                  {...booking}
                  fullWidth={true}
                  isClosed={false}
                  onClick={() =>
                    router.push(
                      `/service-preview/${booking?.subserviceId?._id}`
                    )
                  }
                  details={true}
                />

                {paymentData && (
                  <PurchaseDetail booking={booking} paymentData={paymentData} />
                )}

                <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
                  {paymentData.paymentStatus === "unpaid" &&
                    paymentData.isBefore &&
                    (booking?.status === "confirmed" ||
                      booking?.status === "requested") && (
                      <OutlinedButton
                        onClick={() => setOpenConfirmModal(true)}
                        text={languageData.buttons.cancel[language]}
                        py="py-2"
                        margin="mt-12"
                        dark="darkLight"
                        textSize="text-sm"
                        textColor="text-white"
                        buttonCenter={true}
                        minWidth="200px"
                      />
                    )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Renderiza modales solo si no hay error */}
      {!error && (
        <>
          <ConfirmModalClient
            isOpen={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            onApply={() => cancelBooking()}
            title={languageData.cancelModal.title[language]}
            body={languageData.cancelModal.subtitle[language]}
            apply={languageData.cancelModal.cancel[language]}
          />
          <OrderModal
            booking={booking}
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
          />
        </>
      )}
    </>
  );
}
