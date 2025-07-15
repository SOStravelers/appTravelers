import React from "react";
import clsx from "clsx";

function InputText({
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  error = false,
  className = "",
  disabled = false,
  icon: Icon,
  width,
  noBorder = false,
  marginY = "my-1",
  ...props
}) {
  return (
    <div
      className={clsx("relative", marginY)}
      style={{ width: width || "100%" }}
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "px-3 py-2 rounded-md text-sm transition duration-200 focus:outline-none w-full",
          Icon && "pl-11",
          !noBorder && "border",
          error
            ? "bg-red-100 text-red-800 border-red-500 placeholder-red-500"
            : disabled
            ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
            : [
                "bg-[var(--color-input)] text-[var(--color-text-color)]",
                "border-gray-300",
                "placeholder-[var(--color-text-gray-reverse)]",
                "[&::placeholder]:opacity-70", // ← esta es la línea clave
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
                : "border border-gray-400 peer-focus:border-[var(--color-border-blue)] peer-focus:bg-[var(--color-border-blue)]/10"
            )}
          >
            <Icon
              className={clsx(
                "h-3 w-3 transition",
                error
                  ? "text-red-500"
                  : "text-gray-400 peer-focus:text-[var(--color-border-blue)]"
              )}
            />
          </div>
        </span>
      )}
    </div>
  );
}

export default InputText;
