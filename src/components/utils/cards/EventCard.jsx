import { FaTicketAlt } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";

export default function EventCard({
  title,
  date, // formato ISO: "2025-07-17T22:00:00"
  location,
  imageUrl,
  isClosed = false,
  onClick,
}) {
  const eventDate = new Date(date);
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
    <div className="bg-white shadow-md rounded-xl p-2 max-w-md mx-auto border">
      <div className="rounded-lg overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      </div>

      <div className="px-2 py-3">
        <h3 className="text-lg font-semibold mb-1">
          {title} | {eventDate.toLocaleDateString("pt-BR", { weekday: "long" })}{" "}
          | {eventDate.getDate()}{" "}
          {eventDate.toLocaleDateString("pt-BR", { month: "long" })} |{" "}
          {location}
        </h3>

        <p className="text-gray-600 text-sm mb-2">
          {formattedDate} - {formattedTime}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <FaTicketAlt className="mr-1" />
            {isClosed ? <span>Encerrado</span> : <span>Disponible</span>}
          </div>

          <button
            onClick={onClick}
            disabled={isClosed}
            className={clsx(
              "px-4 py-1 text-sm rounded border font-semibold",
              isClosed
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-500 hover:bg-blue-100"
            )}
          >
            Ingresso
          </button>
        </div>
      </div>
    </div>
  );
}
