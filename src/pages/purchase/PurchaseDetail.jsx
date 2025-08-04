import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaUndoAlt,
  FaClipboardList,
  FaRegClock,
  FaHourglassHalf,
} from "react-icons/fa";

import languageData from "@/language/bookingDetails.json";
import { formatPrice } from "@/utils/format";
import { formatTime } from "@/lib/time";
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
import InfoItem from "@/components/utils/cards/InfoItem";
import OrderModal from "@/components/utils/modal/OrderModal";
import ProviderCard from "@/components/utils/cards/ProviderCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import AddToCalendarButton from "@/components/utils/buttons/AddToCalendarButton";
import ConfirmModalClient from "@/components/utils/modal/ConfirmModalClient";
import { useState } from "react";
import { useStore } from "@/store";
export default function PurchaseDetail({ booking, paymentData }) {
  const { language, currency } = useStore();
  const [isOrderModal, setOrderModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const cancelBooking = async () => {
    console.log("a cancelar");
    setOpenConfirmModal(false);
  };

  return (
    <>
      <div className="mx-5 md:mx-12">
        {/* Detalles visuales */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">
          <InfoItem
            icon={FaRegCalendarAlt}
            label={languageData.infoService.date[language]}
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
            icon={FaRegClock}
            label={languageData.infoService.time[language]}
            value={booking?.startTime?.formatedTime}
            border={true}
            borderColor="border-gray-500"
            bg="bg-backgroundModal"
          />
          <InfoItem
            icon={FaHourglassHalf}
            label={languageData.infoService.duration[language]}
            value={formatTime(booking?.duration)}
            border={true}
            borderColor="border-gray-500"
            bg="bg-backgroundModal"
          />
          <InfoItem
            icon={FaMapMarkerAlt}
            label={languageData.infoService.location[language]}
            value={booking?.location || "Rio de Janeiro"}
            border={true}
            borderColor="border-gray-500"
            bg="bg-backgroundModal"
          />
        </div>
        {/* Estado de pago */}

        <div className="mt-6 ">
          {paymentData.paymentStatus === "paid" ? (
            <div
              className={`flex items-center gap-2 text-sm ${statusData.color}`}
            >
              {statusData.icon}
              <span className="font-semibold">{statusData.text}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-yellow-700 bg-yellow-100 p-4 rounded-lg border border-yellow-200 text-sm ">
              <FaRegCalendarAlt size={40} style={{ marginTop: "-10px" }} />
              <div>
                <p className="font-semibold">
                  {languageData.cardPendingPayment.title[language]}{" "}
                  {formatPrice(booking?.price?.grossAmount, currency)}
                </p>
                <p className="mt-1 text-gray-700">
                  {languageData.cardPendingPayment.body.one[language]}{" "}
                  <strong>{paymentData?.cancelTime?.formatedDate}</strong>{" "}
                  {languageData.cardPendingPayment.body.two[language]}{" "}
                  <strong>{paymentData?.cancelTime?.formatedTime}</strong>.
                  <div>
                    {languageData.cardPendingPayment.body.three[language]}.
                  </div>
                </p>
              </div>
            </div>
          )}
        </div>

        <OutlinedButton
          onClick={() => setOrderModal(true)}
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
          {paymentData.paymentStatus === "unpaid" && paymentData.isBefore && (
            <OutlinedButton
              onClick={() => setOpenConfirmModal(true)}
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
        isOpen={isOrderModal}
        onClose={() => setOrderModal(false)}
      />
      <ConfirmModalClient
        isOpen={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onApply={() => cancelBooking()}
        title={"titulo"}
        body={"cuerpo"}
      />
    </>
  );
}
