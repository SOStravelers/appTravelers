import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import languageData from "@/language/bookingDetails.json";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
import InfoItem from "@/components/utils/cards/InfoItem";
import OrderModal from "@/components/utils/modal/OrderModal";
import ProviderCard from "@/components/utils/cards/ProviderCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import AddToCalendarButton from "@/components/utils/buttons/AddToCalendarButton";
import { useState } from "react";
import { useStore } from "@/store";
export default function PurchaseDetail({ booking, paymentData }) {
  const { language, currency } = useStore();
  const [isFilterOpen, setFilterOpen] = useState(false);
  //   const shareLink = () => {
  //     const text = `¡Ya tengo mi entrada para ${
  //       booking?.subserviceData?.name[language]
  //     } en ${"Rj"}, el ${
  //       formatearFechaCompletaDesdeISO(booking?.startTime?.isoTime, language)
  //         .formatedDate
  //     } a las ${booking?.startTime?.formatedTime}! Nos vemos ahí 🚀`;
  //     const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  //     window.open(url, "_blank");
  //   };

  return (
    <>
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
                  <strong>{paymentData?.cancelTime?.formatedDate}</strong>. a
                  las, <strong>{paymentData?.cancelTime?.formatedTime}</strong>.
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
        <ProviderCard
          provider={booking?.providerId}
          subservice={booking?.subserviceData}
        />

        {/* Acciones */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          {paymentData.paymentStatus === "unPaid" && paymentData.isBefore && (
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
      </div>
      <OrderModal
        booking={booking}
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}
