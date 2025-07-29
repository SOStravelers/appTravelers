// components/utils/Switch.jsx
import React from "react";

/**
 * Interruptor verde (ON) / rojo (OFF), versión compacta.
 * @param {boolean} checked  - Estado actual.
 * @param {function} onChange - Handler que recibe el nuevo estado (true/false).
 */
export default function Switch({ checked, onChange }) {
  return (
    <label className="inline-block relative w-10 h-5 cursor-pointer">
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
          absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow
          transition-transform ${checked ? "translate-x-5" : ""}
        `}
      />
    </label>
  );
}
