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
        `max-w-lg text-white text-md py-${py} w-3/4 mx-auto rounded-full hover:bg-blueBorderLight cursor-pointer`,
        margin ? margin : "my-1",
        secondary
          ? "text-grey border-grey"
          : error
          ? "text-greyText border-lightGrey"
          : "border-blueBorder text-blackText",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "bg-darkBlue": disabled,
          "text-gray-500": disabled,
        }
      )}
      style={{
        backgroundColor:
          !secondary && !error && !disabled
            ? "var(--color-button-light)"
            : undefined,
      }}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
