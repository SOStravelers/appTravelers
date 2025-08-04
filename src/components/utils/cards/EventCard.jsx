import { useState } from "react";
import {
  FaTicketAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaClipboardCheck,
  FaCheckCircle,
  FaRegClock,
  FaUndoAlt,
} from "react-icons/fa";
import clsx from "clsx";
import { useStore } from "@/store";
import { formatearFechaCortaInteligente } from "@/utils/format";
import languageData from "@/language/bookingDetails.json";

export default function EventCard({
  subserviceData,
  startTime,
  location,
  imgUrl,
  isClosed = false,
  onClick,
  fullWidth = false,
  paymentStatus = "unpaid",
  details = true,
  status = "requested",
}) {
  const { language } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const statusIcon = {
    requested: {
      icon: <FaHourglassHalf />,
      text: languageData.status.requested[language],
      color: "text-yellow-500",
    },
    canceled: {
      icon: <FaTimesCircle />,
      text: languageData.status.canceled[language],
      color: "text-red-500",
    },
    confirmed: {
      icon: <FaCheckCircle />,
      text: languageData.status.confirmed[language],
      color: "text-green-500",
    },
    completed: {
      icon: <FaClipboardCheck />,
      text: languageData.status.completed[language],
      color: "text-blue-400",
    },
  };

  const paymentStatusMap = {
    paid: {
      icon: <FaCheckCircle />,
      text: languageData.paymentStatus.paid[language],
      color: "text-green-500",
    },
    unpaid: {
      icon: <FaRegClock />,
      text: languageData.paymentStatus.unpaid[language],
      color: "text-yellow-500",
    },
    refund: {
      icon: <FaUndoAlt />,
      text: languageData.paymentStatus.refund[language],
      color: "text-blue-500",
    },
  };
  const statusData = statusIcon[status];
  const eventDate = new Date(startTime?.isoTime || null);
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={clsx(
        "bg-backgroundModal shadow-md rounded-xl p-3  mb-6",
        fullWidth ? "max-w-lg " : "max-w-sm mx-auto",
        !imageLoaded && "hidden" // Oculta hasta que cargue la imagen
      )}
    >
      <div className="rounded-lg overflow-hidden">
        <img
          src={imgUrl}
          alt={subserviceData?.name[language]}
          className="w-full h-50 object-cover"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="px-2 py-3 ">
        <h3 className="text-sm text-textColor font-semibold mb-1">
          {subserviceData?.name[language]} |{" "}
          {
            formatearFechaCortaInteligente(startTime?.isoTime, language)
              .fechaInteligente
          }{" "}
          | {startTime?.formatedTime}
        </h3>

        {details && (
          <>
            {/* <p className="text-gray-600 text-sm mb-2">
              {formattedDate} - {formattedTime}
            </p> */}
            <div className="flex items-center justify-between ">
              {/* <div className="flex items-center text-sm text-gray-700">
                <FaTicketAlt className="mr-1" />
                {isClosed ? <span>Encerrado</span> : <span>Disponible</span>}
              </div> */}
              <div>
                <div
                  className={`flex items-center gap-2  my-2 text-xs ${statusData.color}`}
                >
                  <span className="text-sm">{statusData.icon}</span>
                  <span>{statusData.text}</span>
                </div>
                {status != "requested" && status != "canceled" && (
                  <div
                    className={`flex items-center gap-2 text-xs ${paymentStatusMap[paymentStatus].color}`}
                  >
                    <span className="text-sm">
                      {paymentStatusMap[paymentStatus].icon}
                    </span>
                    <span>{paymentStatusMap[paymentStatus].text}</span>
                  </div>
                )}
              </div>

              <button
                onClick={onClick}
                disabled={isClosed}
                className={clsx(
                  "px-4 py-1 mt-1 text-xs rounded border font-semibold",
                  isClosed
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-textColor"
                )}
              >
                {languageData.eventButton[language]}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
