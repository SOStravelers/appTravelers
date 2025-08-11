import React, { useRef } from "react";
import clsx from "clsx";
import { FiCalendar } from "react-icons/fi";

function InputText({
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  error = false,
  className = "",
  disabled = false,
  icon: Icon, // ícono izquierdo
  rightIcon: RightIcon, // ícono derecho opcional
  width,
  noBorder = false,
  marginY = "my-1",
  textColorClass = "text-[var(--color-text-color)]", // color para íconos
  ...props
}) {
  const inputRef = useRef(null);

  // Bloquear negativos si es number
  const handleChange = (e) => {
    if (type === "number") {
      const val = e.target.value;
      if (val === "" || Number(val) >= 0) onChange?.(e);
    } else {
      onChange?.(e);
    }
  };

  // Tipos que deben mostrar icono derecho y ocultar el nativo
  const dateLikeTypes = new Set(["date", "datetime-local", "month", "time"]);
  const isDateLike = dateLikeTypes.has(type);
  const Right = RightIcon || FiCalendar;

  return (
    <div
      className={clsx("relative", marginY)}
      style={{ width: width || "100%" }}
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        min={type === "number" ? 0 : undefined}
        className={clsx(
          "px-3 py-2 rounded-md text-sm transition duration-200 focus:outline-none w-full",
          Icon && "pl-11",
          isDateLike && "pr-10 has-custom-calendar", // espacio + oculta indicador nativo
          !noBorder && "border",
          error
            ? "bg-red-100 text-red-800 border-red-500 placeholder-red-500"
            : disabled
            ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
            : [
                "bg-[var(--color-input)]",
                "text-[var(--color-text-color)]",
                "border-gray-300",
                "placeholder-[var(--color-text-gray-reverse)]",
                "[&::placeholder]:opacity-70",
                "focus:ring-1 focus:ring-[var(--color-text-color)]",
              ],
          className
        )}
        {...props}
      />

      {Icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div
            className={clsx(
              "rounded-full p-1 flex items-center justify-center transition",
              error
                ? "border border-red-500 bg-red-100"
                : "border border-gray-400"
            )}
          >
            <Icon
              className={clsx(
                "h-3 w-3 transition",
                error ? "text-red-500" : "text-gray-400"
              )}
            />
          </div>
        </span>
      )}

      {/* Ícono derecho (color controlado por textColorClass) */}
      {isDateLike && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Right className={clsx("h-4 w-4", textColorClass)} />
        </span>
      )}
    </div>
  );
}

export default InputText;
