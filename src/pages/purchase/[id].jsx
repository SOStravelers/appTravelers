import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import BookingService from "@/services/BookingService";
import { alertError } from "@/utils/alerts.jsx";
import languageData from "@/language/purchase.json";
import { isBeforeHoursThreshold } from "@/utils/format";
import OrderModal from "@/components/utils/modal/OrderModal";
import PurchaseDetail from "./PurchaseDetail";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import ConfirmModalClient from "@/components/utils/modal/ConfirmModalClient";
export default function PurchasePage() {
  const { language } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    getBooking();
  }, []);

  const getBooking = async () => {
    try {
      console.log("wena");
      const id = router.query.id;

      const response = await BookingService.getByToken(id);
      const booking = response.data;
      console.log(booking);
      setBooking(booking);

      const timeUntilCancel = booking.timeUntilCancel || 0;
      const cancelData = isBeforeHoursThreshold(
        booking.startTime.isoTime,
        timeUntilCancel,
        language
      );
      cancelData.paymentStatus = booking.paymentStatus;
      cancelData.paymentStatus = "unpaid";
      cancelData.isBefore = true;
      setPaymentData(cancelData);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelBooking = async () => {
    try {
      console.log("a cancelar", router.name, router.pathname, router.query);
      if (router.pathname.includes("purchase")) {
        const response = await BookingService.cancelByToken(
          router.query.id,
          booking._id
        );
        if (response && response.data) {
          setBooking({ ...booking, status: "canceled" });
        }
      }
      setOpenConfirmModal(false);
    } catch (err) {
      console.log(err.status);
      if (err.status == 500) {
        alertError({ message: "Error to change, try later" });
      } else {
        console.log("mesnaje", err.response);
        alertError({ message: err.response.data.error });
      }
    }
  };

  return (
    <>
      <div
        className={`min-h-screen px-4 mb-32 flex flex-col items-center  justify-center bg-backgroundP
      ${loading ? opacityAnimation : displayAnimation}`}
      >
        <div className="bg-backgroundS shadow-md rounded-2xl px-2 flex flex-col  items-center py-3 max-w-3xl w-full  ">
          {/* Encabezado */}
          <div className="text-center mb-6">
            {(booking?.status === "confirmed" ||
              booking?.status === "requested") && (
              <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
            )}
            <h1 className="text-xl md:text-3xl font-bold text-textColor">
              {booking?.status === "confirmed"
                ? languageData.title.confirmed[language]
                : booking?.status === "requested"
                ? languageData.title.requested[language]
                : booking?.status === "canceled"
                ? languageData.title.canceled[language]
                : ""}
            </h1>
            <p className="text-textColorGray mt-2 text-xs md:text-sm">
              {booking?.status === "requested"
                ? languageData.subtitle.requested[language]
                : paymentData?.paymentStatus === "unpaid" &&
                  booking?.status === "confirmed"
                ? languageData.subtitle.unpaid[language]
                : paymentData?.paymentStatus === "paid" &&
                  booking?.status === "confirmed"
                ? languageData.subtitle.paid[language]
                : ""}
            </p>
          </div>

          {/* Tarjeta del evento */}
          <EventCard
            {...booking}
            fullWidth={true}
            isClosed={false}
            onClick={() =>
              router.push(`/service-preview/${booking?.subserviceId?._id}`)
            }
            details={true}
          />

          {booking && paymentData && (
            <PurchaseDetail booking={booking} paymentData={paymentData} />
          )}

          {/* Acciones */}
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            {paymentData.paymentStatus === "unpaid" &&
              paymentData.isBefore &&
              (booking?.status === "confirmed" ||
                booking?.status === "requested") && (
                <OutlinedButton
                  onClick={() => setOpenConfirmModal(true)}
                  text={languageData.cancel[language]}
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

          {/* Link volver */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-textColor hover:underline flex align-items text-center"
            >
              <FaArrowLeft size={18} />
              <p className="ml-2">{languageData.comeback[language]}</p>
            </button>
          </div>
        </div>
      </div>

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
  );
}
