import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import BookingService from "@/services/BookingService";
import languageData from "@/language/purchase.json";
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
        <div className="bg-backgroundS shadow-md rounded-2xl px-2 flex flex-col  items-center py-4 max-w-3xl w-full  ">
          {/* Encabezado */}
          <div className="text-center mb-6">
            <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
            <h1 className="text-xl md:text-3xl font-bold text-textColor">
              {booking?.status === "confirmed"
                ? languageData.title.confirmed[language]
                : languageData.title.requested[language]}
            </h1>
            <p className="text-textColorGray mt-2 text-sm md:text-base">
              {booking?.status === "requested"
                ? languageData.subtitle.requested[language]
                : paymentData?.paymentStatus === "unpaid"
                ? languageData.subtitle.unpaid[language]
                : paymentData?.paymentStatus === "paid"
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

      <OrderModal
        booking={booking}
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}
