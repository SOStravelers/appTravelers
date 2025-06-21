import React from "react";
import clsx from "clsx";

function OutlinedButton({
  text,
  secondary,
  py = 2,
  error,
  disabled,
  margin,
  ...props
}) {
  return (
    <button
      className={clsx(
        `border-2 border-solid max-w-lg text-lg py-${py} w-full rounded-xl cursor-pointer`,
        margin ? margin : "my-2",
        secondary
          ? "text-grey border-grey"
          : error
          ? "text-greyText border-lightGrey"
          : "border-blueBorder text-blackText bg-blueButton",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "bg-gray-300": disabled,
          "text-gray-500": disabled,
        } // Estilos cuando está desactivado
      )}
      disabled={disabled} // Establece el atributo disabled basado en la prop
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
