import React from "react";
import clsx from "clsx";
import { ChatButtonIcon } from "@/constants/icons";

function OutlinedChatButton({ text, disabled, margin = "", ...props }) {
  return (
    <button
      className={clsx(
        "flex justify-center items-center border-1 border-solid max-w-md text-lg py-1 w-48 rounded-lg cursor-pointer bg-lightGrey",
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

export default OutlinedChatButton;
