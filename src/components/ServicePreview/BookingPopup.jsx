import React from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

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
    w-full max-w-lg mx-auto bg-backgroundModal border border-backgroundS
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
        {tagLine && (
          <span className="text-xxs text-warningColor ">{tagLine}</span>
        )}
      </div>
      <button disabled={isDisabled} dark={"darkS"}></button>
      <OutlinedButton
        onClick={onAction}
        text={buttonText}
        px={4}
        py="py-2"
        minWidth="140px"
        dark="darkHeavy"
        textColor="text-white"
        disabled={isDisabled}
        buttonCenter={false}
      />
    </div>
  );
};

export default BookingPopup;
