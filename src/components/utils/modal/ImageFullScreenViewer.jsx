import { useEffect, useRef, useState } from "react";

export default function ImageFullScreenViewer({ src, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative transform transition-all duration-300 max-w-4xl w-full mx-4
          ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
        >
          &times;
        </button>

        <img
          src={src}
          alt="Vista ampliada"
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
