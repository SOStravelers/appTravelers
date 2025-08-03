import { useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import clsx from "clsx";
import { useStore } from "@/store";
import { formatearFechaCortaInteligente } from "@/utils/format";

export default function EventCard({
  subserviceData,
  startTime,
  location,
  imgUrl,
  isClosed = false,
  onClick,
  fullWidth = false,
  details = true,
}) {
  const { language } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);

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
        <h3 className="text-lg text-textColor font-semibold mb-1">
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
            <div className="flex items-center justify-end">
              {/* <div className="flex items-center text-sm text-gray-700">
                <FaTicketAlt className="mr-1" />
                {isClosed ? <span>Encerrado</span> : <span>Disponible</span>}
              </div> */}

              <button
                onClick={onClick}
                disabled={isClosed}
                className={clsx(
                  "px-4 py-1 mt-1 text-sm rounded border font-semibold",
                  isClosed
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-textColor"
                )}
              >
                Info del servicio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
