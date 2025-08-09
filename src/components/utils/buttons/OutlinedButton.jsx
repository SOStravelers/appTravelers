import React from "react";
import clsx from "clsx";

function OutlinedButton({
  text,
  icon: Icon,
  secondary = false,
  error = false,
  disabled = false,
  px = "px-4", // ahora recibe la clase completa
  py = "py-2", // igual que margin
  textColor = "text-blackText",
  textSize = "text-sm",
  dark = "darkHeavy",
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
        "rounded-full max-w-md cursor-pointer flex items-center justify-center gap-2",
        textSize,
        margin,
        buttonCenter ? "w-2/3 mx-auto md:w-1/2" : px,
        py,
        "hover:brightness-200 transition duration-200",
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
      {Icon && <Icon className={`h-5 w-5 ${textColor}`} />}
      {text}
    </button>
  );
}

export default OutlinedButton;
