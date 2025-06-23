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
        `border-2 border-solid max-w-lg text-md py-${py} w-3/4 mx-auto rounded-xl cursor-pointer`,
        margin ? margin : "my-1",
        secondary
          ? "text-grey border-grey"
          : error
          ? "text-greyText border-lightGrey"
          : "border-blueBorder text-blackText bg-blueButton",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "bg-gray-300": disabled,
          "text-gray-500": disabled,
        }
      )}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
