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
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(
        "px-3 py-2 rounded-md border text-sm transition duration-200 focus:outline-none",
        error
          ? "bg-red-100 text-red-800 border-red-500 placeholder-red-500"
          : disabled
          ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
          : "bg-[var(--color-input)] text-[var(--color-text-color)] border-gray-300 placeholder-[var(--color-text-gray-reverse)] focus:ring-1 focus:ring-[var(--color-text-color)]",
        className
      )}
      {...props}
    />
  );
}

export default InputText;
