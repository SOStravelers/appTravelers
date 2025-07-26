import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import AddToCalendarButton from "@/components/utils/buttons/AddToCalendarButton";
import TablePriceSummary from "@/components/utils/cards/tablePrice";
import BookingService from "@/services/BookingService";
import languageData from "@/language/purchase.json";
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
import InfoItem from "@/components/utils/cards/InfoItem";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaShareAlt,
  FaDownload,
  FaArrowLeft,
} from "react-icons/fa";

export default function MyBookingPage() {
  const { language, user, currency } = useStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [notAllowed, setNotAllowed] = useState(false);
  const router = useRouter();

  const event = {
    title: "Soldierbeat",
    date: "2025-07-17T22:00:00",
    location: "TAU",
    imageUrl: "/images/soldierbeat.jpg",
  };

  const reservation = {
    paymentConfirmed: false,
    paymentDueDate: "2025-07-25T23:00:00",
  };

  const operator = {
    name: "Carlos Duarte",
    email: "carlos.duarte@sostravelers.com",
    phone: "+55 21 91234-5678",
    avatar: "/images/operator-carlos.jpg",
  };

  const getWhatsappLink = (phone, name) => {
    const rawPhone = phone.replace(/\D/g, "");
    const message = `Hola ${name}, tengo una consulta sobre mi reserva en SOS Travelers.`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

  const getBooking = async () => {
    try {
      const id = router.query.id;
      const response = await BookingService.getMyBooking(id);
      setBooking(response.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        setNotAllowed(true);
      } else {
        console.error("Error al obtener booking:", err);
        setNotAllowed(true);
      }
    } finally {
      delay(() => setLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    getBooking();
  }, []);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const shareLink = () => {
    const text = `¡Ya tengo mi entrada para ${event.title} en ${event.location}, el ${formattedDate} a las ${formattedTime}! Nos vemos ahí 🚀`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (notAllowed && !loading) {
    return (
      <div
        className={` px-4 flex flex-col mt-12 items-center justify-center bg-backgroundP ${
          loading ? opacityAnimation : displayAnimation
        }`}
      >
        <div className="bg-backgroundS text-center px-4 shadow-md rounded-2xl py-8 max-w-lg w-full">
          <FaRegCalendarAlt className="text-4xl mb-4 text-textColor mx-auto" />
          <h2 className="text-xl text-textColor font-semibold mb-2">
            This booking is not available
          </h2>
          <p className="text-sm text-textColorGray">
            The reservation you’re trying to access is no longer available or
            you don’t have permission to view it.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-blue-600 hover:bg-blue-50 transition"
          >
            <FaArrowLeft className="text-textColorGray" />
            <p className="text-textColorGray">Return to homepage</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-12 flex flex-col items-center justify-center bg-backgroundP ${
        loading ? opacityAnimation : displayAnimation
      }`}
    >
      <div className="bg-backgroundS shadow-md rounded-2xl py-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
          <h1 className="text-2xl md:text-4xl font-bold text-textColor">
            {reservation.paymentConfirmed
              ? "¡Compra confirmada!"
              : "¡Reserva realizada!"}
          </h1>
          <p className="text-textColorGray mt-2 text-md md:text-base">
            {reservation.paymentConfirmed
              ? "Tu entrada ha sido procesada exitosamente."
              : "Tu lugar ha sido reservado, el pago se realizará más adelante."}
          </p>
        </div>

        <EventCard
          {...booking}
          fullWidth={true}
          isClosed={true}
          onClick={() => {}}
          details={false}
        />

        <div className="mx-5 md:mx-12">
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <InfoItem
              icon={FaUser}
              label="Comprador"
              value={booking?.clientData?.name}
              border={true}
              borderColor="border-gray-500"
              bg="bg-backgroundModal"
            />
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
              value={event.location}
              border={true}
              borderColor="border-gray-500"
              bg="bg-backgroundModal"
            />
          </div>

          <div className="mt-6">
            {reservation.paymentConfirmed ? (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <FaCheckCircle />
                <span className="font-semibold">Pago confirmado</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-yellow-700 bg-yellow-100 p-4 rounded-lg border border-yellow-200 text-sm">
                <FaRegCalendarAlt size={40} style={{ marginTop: "-10px" }} />
                <div>
                  <p className="font-semibold">Pago pendiente</p>
                  <p className="mt-1 text-gray-700">
                    Se realizará el{" "}
                    <strong>
                      {new Date(reservation.paymentDueDate).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </strong>
                    . Puedes cancelar antes de esa fecha.
                  </p>
                </div>
              </div>
            )}
          </div>

          <TablePriceSummary
            confirmed={booking?.statusn || "confirmed"}
            price={booking?.price || {}}
          />

          {reservation.paymentConfirmed && (
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
                  <a href={`tel:${operator.phone}`} className="hover:underline">
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
                  className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
                >
                  💬 Hablar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            {reservation.paymentConfirmed ? (
              <>
                <button
                  onClick={() => alert("Descargando entrada...")}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaDownload /> Descargar entrada
                </button>
                <button
                  onClick={shareLink}
                  className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
                >
                  <FaShareAlt /> Compartir en WhatsApp
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
  );
}
