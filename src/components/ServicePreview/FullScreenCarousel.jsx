// components/ServicePreview/FullScreenCarousel.jsx
import { useState, useEffect } from "react";

const FullScreenCarousel = ({ media = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset currentIndex when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Navigate backwards
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  // Navigate forwards
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") handlePrev();
      if (e.key === "ArrowRight" || e.key === "d") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [media.length, onClose]);

  // Don't render if there's no media
  if (!media.length) return null;

  const current = media[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-filter backdrop-blur-sm"
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

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Prev Arrow */}
        {media.length > 1 && (
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl focus:outline-none bg-black bg-opacity-50 rounded-full p-2 z-10"
            onClick={handlePrev}
          >
            &#10094;
          </button>
        )}

        {/* Next Arrow */}
        {media.length > 1 && (
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl focus:outline-none bg-black bg-opacity-50 rounded-full p-2 z-10"
            onClick={handleNext}
          >
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
};

export default FullScreenCarousel;
