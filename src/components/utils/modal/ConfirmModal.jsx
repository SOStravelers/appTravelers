// components/utils/ConfirmModal.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
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
          bg-white rounded-lg w-full max-w-md p-6 mx-4 border-2 border-red-600
          transform transition-all duration-200 ease-out
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center mb-4 text-red-700">
          <FaExclamationTriangle className="mr-2" />
          <h3 className="text-lg font-semibold">Confirmar acción</h3>
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
            className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
