import React from "react";
import clsx from "clsx";

function OutlinedButton({
  text,
  secondary = false,
  error = false,
  disabled = false,
  px = 4,
  py = 2,
  textColor = "text-blackText",
  textSize = "text-sm",
  dark = "darkHeavy", // "darkHeavy" o "darkP"
  margin = "my-1",
  buttonCenter = false,
  minWidth,
  ...props
}) {
  const darkBg =
    dark === "darkHeavy"
      ? "var(--color-button-heavy)"
      : "var(--color-button-light)";

  return (
    <button
      className={clsx(
        "rounded-full cursor-pointer",
        textSize,
        buttonCenter ? "w-2/3 mx-auto block text-center" : `px-${px}`,
        `py-${py}`,
        margin,
        {
          "text-grey border-grey": secondary,
          "text-greyText border-lightGrey": error,
          [textColor]: !secondary && !error,
          "bg-gray-400 border-gray-400 text-gray-500 cursor-not-allowed opacity-60":
            disabled,
          "hover:bg-blueBorderLight": !disabled,
        }
      )}
      style={{
        backgroundColor: !secondary && !error && !disabled ? darkBg : undefined,
        minWidth: minWidth || undefined,
      }}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
