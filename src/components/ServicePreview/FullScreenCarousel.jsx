import { useState, useEffect } from 'react';

const FullScreenCarousel = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        handlePrev();
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        handleNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setCurrentIndex(initialIndex)
    };
  }, [images.length, onClose]); // Add images.length and onClose to dependencies

  if (!images || images.length === 0) {
    return null; // Don't render if no images
  }
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-filter backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full h-full max-w-screen-xl max-h-screen-xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          // className='relative w-full max-h-[90vh] object-contain transition-transform duration-300 ease-in-out transform scale-100 hover:scale-105'
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl focus:outline-none bg-black bg-opacity-50 rounded-full p-2 z-10"
          onClick={handlePrev}
        >
          &#10094;
        </button>}
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl focus:outline-none bg-black bg-opacity-50 rounded-full p-2"
          onClick={handleNext}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};



export default FullScreenCarousel;