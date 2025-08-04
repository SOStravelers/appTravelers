import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import BookingService from "@/services/BookingService";
import languageData from "@/language/bookingDetails.json";
import { isBeforeHoursThreshold } from "@/utils/format";
import OrderModal from "@/components/utils/modal/OrderModal";
import PurchaseDetail from "@/pages/purchase/PurchaseDetail";

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

      const response = await BookingService.getMyBooking(id);
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
          <div className="flex flex-row align-end justify-end mb-3">
            <h1 className="text-lg mr-2   text-textColor">
              {languageData.bookingNumber[language]}:
            </h1>
            <p className="text-textColorGray text-lg">
              {booking?.purchaseOrder}
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
