import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import BookingService from "@/services/BookingService";
import languageData from "@/language/bookingDetails.json";
import { isBeforeHoursThreshold } from "@/utils/format";
import OrderModal from "@/components/utils/modal/OrderModal";
import PurchaseDetail from "./PurchaseDetail";

import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function PurchasePage() {
  const { language } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});

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

  return (
    <>
      <div
        className={`min-h-screen px-4 mb-32 flex flex-col items-center  justify-center bg-backgroundP
      ${loading ? opacityAnimation : displayAnimation}`}
      >
        <div className="bg-backgroundS shadow-md rounded-2xl px-2 flex flex-col  items-center py-8 max-w-3xl w-full  ">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
            <h1 className="text-2xl md:text-4xl font-bold text-textColor">
              {paymentData.paymentStatus === "paid"
                ? "¡Compra confirmada!"
                : "¡Reserva realizada!"}
            </h1>
            <p className="text-textColorGray mt-2 text-md md:text-base">
              {paymentData.paymentStatus === "paid"
                ? "Tu entrada ha sido procesada exitosamente."
                : "Tu lugar ha sido reservado, el pago se realizará más adelante."}
            </p>
          </div>

          {/* Tarjeta del evento */}
          <EventCard
            {...booking}
            fullWidth={true}
            isClosed={false}
            onClick={() => {}}
            details={true}
          />

          {booking && paymentData && (
            <PurchaseDetail booking={booking} paymentData={paymentData} />
          )}

          {/* Link volver */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-textColor hover:underline flex align-items text-center"
            >
              <FaArrowLeft size={18} />
              <p>Volver al inicio</p>
            </button>
          </div>
        </div>
      </div>

      <OrderModal
        booking={booking}
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}
