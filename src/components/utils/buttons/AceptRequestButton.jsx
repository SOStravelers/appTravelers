import React from "react";
import clsx from "clsx";
import { ChatButtonIcon } from "@/constants/icons";

function AcceptRequestButton({ text, disabled, margin = "my-2", ...props }) {
  return (
    <button
      className={clsx(
        "flex justify-center items-center border-2 border-solid max-w-lg text-lg py-3 w-full rounded-xl cursor-pointer bg-lightGrey",
        margin,
        {
          "opacity-50 cursor-not-allowed": disabled,
          "bg-gray-300": disabled,
          "text-gray-500": disabled,
        } // Estilos cuando está desactivado
      )}
      disabled={disabled} // Establece el atributo disabled basado en la prop
      {...props}
    >
      <ChatButtonIcon className="mr-2" />
      {text}
    </button>
  );
}

export default AcceptRequestButton;
