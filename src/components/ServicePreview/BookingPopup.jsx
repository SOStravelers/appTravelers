import React from "react";

/**
 * BookingPopup
 * A bottom-fixed popup prompting users to book the service.
 * Props:
 * - priceLabel: string (e.g. "Desde R$571")
 * - subtext: string (e.g. "por viajero")
 * - tagLine: string (e.g. "Cancelación gratuita")
 * - buttonText: string (e.g. "Revisa las fechas")
 * - onAction: () => void (handler when button clicked)
 */
const BookingPopup = ({
  priceLabel = "Precio no disponible",
  subtext = "",
  tagLine = "",
  buttonText = "Reservar",
  onAction = () => {},
}) => {
  return (
    <div
      className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 \
        w-[90%] max-w-xl bg-white rounded-full \
         shadow-[0_10px_20px_rgba(0,0,0,0.25),50px_20px_60px_rgba(0,0,0,0.1)] \
        flex items-center justify-between px-6 py-2"
    >
      <div className="flex flex-col">
        <span className="text-md font-semibold text-gray-900">
          {priceLabel}
        </span>
        {subtext && <span className="text-xs text-gray-600">{subtext}</span>}
        {tagLine && (
          <span className="text-xs text-red-500 mt-1">{tagLine}</span>
        )}
      </div>
      <button
        onClick={onAction}
        className="ml-2 bg-blueBorder text-white text-md px-3 py-2 rounded-full \
           hover:bg-blueBorderLight focus:outline-none"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BookingPopup;
