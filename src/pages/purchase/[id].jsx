import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import AddToCalendarButton from "@/components/utils/buttons/AddToCalendarButton";
import BookingService from "@/services/BookingService";
import languageData from "@/language/bookingDetails.json";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
import InfoItem from "@/components/utils/cards/InfoItem";
import OrderModal from "@/components/utils/modal/OrderModal";
import ProviderCard from "@/components/utils/cards/ProviderCard";

import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";

export default function PurchasePage() {
  const { language, currency } = useStore();
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
      setPaymentData(cancelData);
    } catch (err) {
      console.log(err);
    }
  };

  const shareLink = () => {
    const text = `¡Ya tengo mi entrada para ${
      booking?.subserviceData?.name[language]
    } en ${"Rj"}, el ${
      formatearFechaCompletaDesdeISO(booking?.startTime?.isoTime, language)
        .formatedDate
    } a las ${booking?.startTime?.formatedTime}! Nos vemos ahí 🚀`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
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

          <div className="mx-5 md:mx-12">
            {/* Detalles visuales */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <InfoItem
                icon={FaRegCalendarAlt}
                label="Fecha"
                value={
                  formatearFechaCompletaDesdeISO(
                    booking?.startTime?.isoTime,
                    language
                  ).formatedDate
                }
                border={true}
                borderColor="border-gray-500"
                bg="bg-backgroundModal"
              />
              <InfoItem
                icon={FaClock}
                label="Hora"
                value={booking?.startTime?.formatedTime}
                border={true}
                borderColor="border-gray-500"
                bg="bg-backgroundModal"
              />
              <InfoItem
                icon={FaMapMarkerAlt}
                label="Lugar"
                value={"Rj"}
                border={true}
                borderColor="border-gray-500"
                bg="bg-backgroundModal"
              />
            </div>
            {/* Estado de pago */}
            <div className="mt-6 ">
              {paymentData.paymentStatus === "paid" ? (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <FaCheckCircle />
                  <span className="font-semibold">Pago confirmado</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-yellow-700 bg-yellow-100 p-4 rounded-lg border border-yellow-200 text-sm ">
                  <FaRegCalendarAlt size={40} style={{ marginTop: "-10px" }} />
                  <div>
                    <p className="font-semibold">
                      Pago pendiente de{" "}
                      {formatPrice(booking?.price?.grossAmount, currency)}
                    </p>
                    <p className="mt-1 text-gray-700">
                      Se realizará el{" "}
                      <strong>{paymentData?.cancelTime?.formatedDate}</strong>.
                      a las,{" "}
                      <strong>{paymentData?.cancelTime?.formatedTime}</strong>.
                      <div>Puedes cancelar antes de esa fecha.</div>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <OutlinedButton
              onClick={() => setFilterOpen(true)}
              text=" Ver detalles de orden"
              py={3}
              margin="my-5"
              icon={FaClipboardList}
              dark="darkLight"
              textSize="text-md"
              textColor="text-white"
              buttonCenter={true}
              minWidth="260px"
            />

            <AddToCalendarButton
              title={booking?.subserviceData?.name[language]}
              location="Rj"
              date={booking?.startTime?.isoTime || null}
            />

            {/* Código QR (si está pagado) */}
            {/* {paymentData.paymentStatus === "paid" && (
              <div className="mt-8 flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner text-center">
                  <img
                    src="/images/qr-placeholder.png"
                    alt="Código QR"
                    className="w-32 h-32 mx-auto mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Muestra este QR al ingresar
                  </p>
                </div>
              </div>
            )} */}

            {/* Datos del operador */}
            {booking?.providerId && (
              <ProviderCard
                provider={booking?.providerId}
                subservice={booking?.subserviceData}
              />
            )}

            {/* Acciones */}
            <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
              {paymentData.paymentStatus === "paid" ? (
                <></>
              ) : (
                <OutlinedButton
                  onClick={() => setFilterOpen(true)}
                  text=" Cancelar reserva"
                  py={3}
                  margin="mt-12"
                  dark="darkLight"
                  textSize="text-md"
                  textColor="text-white"
                  buttonCenter={true}
                  minWidth="260px"
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
                <p>Volver al inicio</p>
              </button>
            </div>
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
