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
  isDisabled = false,
  onAction = () => {},
}) => {
  return (
    <div
      className="fixed bottom-11 left-1/2 transform -translate-x-1/2 z-30
    w-full max-w-xl bg-backgroundS border border-backgroundS
    flex items-center justify-between px-3 py-2 rounded-xl "
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-sm mt-1 font-semibold text-textColor">
            {priceLabel}
          </span>
          {subtext && (
            <span className="text-xxs mt-1 ml-4 text-textColorGray">
              {subtext}
            </span>
          )}
        </div>
        {tagLine && <span className="text-xxs text-red-500 ">{tagLine}</span>}
      </div>
      <button
        onClick={onAction}
        disabled={isDisabled} // asegúrate de pasar esta prop o controlarla como quieras
        className={`ml-2 text-sm px-6 py-2 rounded-full min-w-[160px]
    text-white bg-darkBlue hover:bg-blueBorderLight focus:outline-none
    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BookingPopup;
