// components/ServicePreview/Gallery.jsx
import React from "react";
import { MdCollections } from "react-icons/md";

/**
 * Gallery
 * Props:
 * - images: string[]
 * - videos: string[]
 * - onImageClick: (index: number) => void
 * - onViewAllClick: () => void
 */
const Gallery = ({
  images = [],
  videos = [],
  onImageClick,
  onViewAllClick,
}) => {
  const media = [
    ...images.map((url) => ({ url, type: "image" })),
    ...videos.map((url) => ({ url, type: "video" })),
  ];
  const visible = media.slice(0, 4);
  const extraCount = media.length - visible.length;
  const gridClasses =
    visible.length === 1
      ? "grid-cols-1"
      : visible.length === 2
      ? "grid-cols-2"
      : "grid-cols-2 grid-rows-2";

  return (
    <div className="gallery-container mt-8">
      <h3 className="text-lg font-semibold mb-4">Gallery</h3>
      {visible.length > 0 ? (
        <div className={`grid ${gridClasses} gap-2 rounded-lg overflow-hidden`}>
          {visible.map((item, i) => (
            <div
              key={i}
              className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer"
              onClick={() =>
                i === 3 && extraCount > 0 ? onViewAllClick() : onImageClick(i)
              }
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {i === 3 && extraCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <MdCollections className="text-white text-3xl" />
                  <span className="absolute bottom-2 right-2 bg-white bg-opacity-75 text-gray-900 text-xs px-1 rounded">
                    +{extraCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No media available.</p>
      )}
    </div>
  );
};

export default Gallery;
