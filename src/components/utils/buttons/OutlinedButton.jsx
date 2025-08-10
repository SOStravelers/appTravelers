import React from "react";
import clsx from "clsx";

function OutlinedButton({
  text,
  icon: Icon,
  secondary = false,
  error = false,
  disabled = false,
  textColor = "text-blackText",
  textSize = "text-sm",
  dark = "darkHeavy",
  centerWide = false, // centra y w-2/3 md:w-1/2
  align, // "left" | "center" | "right" (solo si no usas centerWide)
  width = "w-fit", // ancho personalizado
  minWidth, // ancho mínimo en px, rem, etc.
  margin = "my-1", // margen personalizado
  padding = "px-4 py-2", // padding personalizado
  className,
  ...props
}) {
  const darkBg =
    dark === "darkHeavy"
      ? "var(--color-button-heavy)"
      : "var(--color-button-light)";

  const widthClass = centerWide
    ? "min-w-[250px] mt-3 w-4/5 md:w-2/5 py-3 md:py-4"
    : width;

  const alignClass = centerWide
    ? "mx-auto"
    : align === "center"
    ? "mx-auto"
    : align === "right"
    ? "ml-auto"
    : ""; // por defecto left

  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-2 rounded-full",
        "transition duration-200 hover:brightness-200",
        textSize,
        textColor,
        margin,
        widthClass,
        alignClass,
        padding,
        {
          "text-grey border-grey": secondary,
          "text-greyText border-lightGrey": error,
          "bg-gray-400 border-gray-400 text-gray-500 cursor-not-allowed opacity-60":
            disabled,
          "hover:bg-blueBorderLight": !disabled,
        },
        className
      )}
      style={{
        backgroundColor: !secondary && !error && !disabled ? darkBg : undefined,
        minWidth: minWidth || undefined, // 👈 control total del min-width
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
