import React from "react";
import clsx from "clsx";

function InputText({
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = false,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(
        "px-3 py-2 rounded-md border text-sm transition duration-200 focus:outline-none focus:ring-1",
        error
          ? "bg-red-100 text-red-800 border-red-500 placeholder-red-500"
          : "bg-[var(--color-input)] text-[var(--color-text-color)] border-gray-300 placeholder-[var(--color-text-gray-reverse)]",
        !error && "focus:ring-[var(--color-text-color)]",
        className
      )}
      {...props}
    />
  );
}

export default InputText;
