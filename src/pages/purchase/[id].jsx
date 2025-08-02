import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import AddToCalendarButton from "@/components/utils/buttons/AddToCalendarButton";
import BookingService from "@/services/BookingService";
import languageData from "@/language/purchase.json";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
import InfoItem from "@/components/utils/cards/InfoItem";
import OrderModal from "@/components/utils/modal/OrderModal";
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
  FaShareAlt,
  FaClipboardList,
  FaDownload,
} from "react-icons/fa";

export default function PurchasePage() {
  const { language, user, currency } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  const operator = {
    name: "Carlos Duarte",
    email: "carlos.duarte@sostravelers.com",
    phone: "+55 21 91234-5678",
    avatar: "/images/operator-carlos.jpg", // foto circular
  };
  const getWhatsappLink = (phone, name) => {
    const rawPhone = phone.replace(/\D/g, ""); // Elimina espacios y símbolos
    const message = `Hola ${name}, tengo una consulta sobre mi reserva en SOS Travelers.`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

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
      // cancelData.paymentStatus = "unpaid";
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
            details={false}
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

            {/* Código QR (si está pagado) */}
            {paymentData.paymentStatus === "paid" && (
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
            )}

            {/* Datos del operador */}
            <div className="mt-10 text-sm text-gray-800 border-t pt-6 border-gray-200">
              <h2 className="text-base font-semibold mb-4 text-center">
                Operador responsable del servicio
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center">
                <img
                  src={operator.avatar}
                  alt={operator.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                />
                <div className="text-center md:text-left">
                  <p className="font-semibold text-lg">{operator.name}</p>
                  <p className="text-sm text-gray-600">
                    <a
                      href={`tel:${operator.phone}`}
                      className="hover:underline"
                    >
                      📞 {operator.phone}
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    <a
                      href={`mailto:${operator.email}`}
                      className="hover:underline"
                    >
                      ✉️ {operator.email}
                    </a>
                  </p>

                  <a
                    href={getWhatsappLink(operator.phone, operator.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition"
                  >
                    💬 Hablar por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
              {paymentData.paymentStatus === "paid" ? (
                <>
                  <button
                    onClick={() => alert("Descargando entrada...")}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaDownload />
                    Descargar entrada
                  </button>
                  <button
                    onClick={shareLink}
                    className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-100 transition"
                  >
                    <FaShareAlt />
                    Compartir en WhatsApp
                  </button>
                  <AddToCalendarButton
                    title="Soldierbeat"
                    location="TAU"
                    date="2025-07-17T22:00:00"
                  />
                </>
              ) : (
                <button
                  onClick={() => alert("Cancelar reserva")}
                  className="flex items-center justify-center gap-2 border border-red-500 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition"
                >
                  Cancelar reserva
                </button>
              )}
            </div>

            {/* Link volver */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-blue-600 hover:underline"
              >
                Volver al inicio
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
