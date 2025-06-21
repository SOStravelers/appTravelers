import { useState, useEffect, useCallback } from "react";

/* eslint-disable @next/next/no-img-element */ // ← seguimos usando <img/> por simplicidad

const FullScreenCarousel = ({ media = [], initialIndex = 0, onClose }) => {
  /* ---------------- state ---------------- */
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  /* ---------------- efectos ---------------- */
  // sincronizar cuando cambia `initialIndex`
  useEffect(() => setCurrentIndex(initialIndex), [initialIndex]);

  /* ---------------- navegación ---------------- */
  const handlePrev = useCallback(
    () => setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1)),
    [media.length]
  );

  const handleNext = useCallback(
    () => setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1)),
    [media.length]
  );

  // controles de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") handlePrev();
      if (e.key === "ArrowRight" || e.key === "d") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  /* ---------------- early-return ---------------- */
  if (!media.length) return null;
  const current = media[currentIndex];

  /* ---------------- render ---------------- */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-screen-xl max-h-screen-xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {current.type === "video" ? (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <img
            src={current.url}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* close */}
        <button
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* arrows */}
        {media.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white text-4xl bg-black/50 rounded-full p-2 focus:outline-none z-10"
              onClick={handlePrev}
            >
              &#10094;
            </button>
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white text-3xl bg-black/50 rounded-full p-2 focus:outline-none z-10"
              onClick={handleNext}
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FullScreenCarousel;
