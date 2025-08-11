// components/utils/ConfirmModal.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const VARIANT_COLORS = {
  confirm: {
    bg: "bg-green-100",
    border: "border-green-600",
    text: "text-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
  cancel: {
    bg: "bg-red-100",
    border: "border-red-600",
    text: "text-red-700",
    button: "bg-red-600 hover:bg-red-700",
  },
  cancelWithNoPayment: {
    bg: "bg-red-100",
    border: "border-red-600",
    text: "text-red-700",
    button: "bg-red-600 hover:bg-red-700",
  },
  refund: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-700",
    button: "bg-yellow-500 hover:bg-yellow-600",
  },
  capturePayment: {
    bg: "bg-blue-100",
    border: "border-blue-600",
    text: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  default: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-gray-700",
    button: "bg-gray-600 hover:bg-gray-700",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  variant = "default",
}) {
  const styles = VARIANT_COLORS[variant] || VARIANT_COLORS.default;

  return (
    <div
      className={`
        fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm
        flex items-center justify-center z-50
        transition-opacity duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          ${styles.bg} ${styles.border}
          rounded-lg w-full max-w-md p-6 mx-4 border-2
          transform transition-all duration-200 ease-out
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        {/* Header */}
        <div className={`flex items-center mb-4 ${styles.text}`}>
          <FaExclamationTriangle className="mr-2" />
          <h3 className="text-lg font-semibold">Confirmar acción:</h3>
        </div>

        {/* Body */}
        <p className="mb-6 text-sm">{message}</p>

        {/* Footer */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-1.5 rounded text-white text-sm ${styles.button}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
