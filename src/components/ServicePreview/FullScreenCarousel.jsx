/* components/ServicePreview/FullScreenCarousel.jsx */
import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

/* eslint-disable @next/next/no-img-element */
export default function FullScreenCarousel({
  media = [],
  initialIndex = 0,
  onClose,
}) {
  const [idx, setIdx] = useState(initialIndex);
  const [mounted, setMounted] = useState(false); // portal listo

  // Crear nodo portal solo 1 vez
  useEffect(() => {
    const node = document.createElement("div");
    document.body.appendChild(node);
    setMounted(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);

  // Navegación
  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? media.length - 1 : i - 1)),
    [media.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === media.length - 1 ? 0 : i + 1)),
    [media.length]
  );

  // Teclado + bloqueo scroll
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", key);
    const { style } = document.body;
    const old = style.overflow;
    style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      style.overflow = old;
    };
  }, [prev, next, onClose]);

  if (!media.length || !mounted) return null; // aún no hay portal
  const current = media[idx];

  // --- contenido del lightbox ---
  const lightbox = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90"
      onClick={onClose} // <-- Clic fuera cierra
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-10"
      >
        &times;
      </button>

      {/* Flechas de navegación */}
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2
                       text-white text-4xl bg-black/50 rounded-full p-2 z-10"
          >
            &#10094;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2
                       text-white text-4xl bg-black/50 rounded-full p-2 z-10"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Imagen o video */}
      <div
        className="max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // <-- clic dentro NO cierra
      >
        {current.type === "video" ? (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-h-full h-full w-auto object-contain"
          />
        ) : (
          <img
            src={current.url}
            alt=""
            className="max-h-full h-full w-auto object-contain"
          />
        )}
      </div>
    </div>
  );

  // --- render en portal ---
  return createPortal(lightbox, mounted);
}
