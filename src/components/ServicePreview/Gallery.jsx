import { useState } from 'react';

const Gallery = ({ images = [], onViewAllClick }) => {
  const visibleImages = images.slice(0, 4);
  // Removed isCarouselOpen state as it's handled by the parent page

  // Function to determine the grid layout based on the number of visible images
  const getGridLayout = () => {
    if (visibleImages.length === 1) return 'grid-cols-1';
    if (visibleImages.length === 2) return 'grid-cols-2';
    return 'grid-cols-2 grid-rows-2'; // Default for 3 or 4 images
  };

  return (
    <div className="gallery-container mt-8">
      <h3 className="text-lg font-semibold mb-4">Gallery</h3>
      {images.length > 0 ? (
        <>
          <div className={`grid ${getGridLayout()} gap-2 rounded-lg overflow-hidden`}>
            {visibleImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full h-40 overflow-hidden rounded-lg">
                <img
                  src={imageUrl} // No click handler on individual images in the grid
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              className="text-blue-600 font-semibold border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={onViewAllClick}
            >
              Ver las {images.length} fotos
            </button>
          </div>
        </>
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default Gallery;