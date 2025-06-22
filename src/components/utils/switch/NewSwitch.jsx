// components/utils/Switch.jsx
import React from "react";

/**
 * Interruptor verde (ON) / rojo (OFF).
 * @param {boolean} checked  - Estado actual.
 * @param {function} onChange - Handler que recibe el nuevo estado (true/false).
 */
export default function Switch({ checked, onChange }) {
  return (
    <label className="inline-block relative w-14 h-7 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className={`absolute inset-0 rounded-full transition-colors
          ${checked ? "bg-green-500" : "bg-red-500"} peer-focus:ring-2`}
      />
      <span
        className={`
          absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow
          transition-transform ${checked ? "translate-x-7" : ""}
        `}
      />
    </label>
  );
}
