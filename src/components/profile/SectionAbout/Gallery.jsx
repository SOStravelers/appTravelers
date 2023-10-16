import { useState } from "react";
import Image from "next/image";

  

function Gallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };
  return (
    <div className="my-5">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        Gallery
      </h1>
      <div className="grid grid-cols-2 gap-1">
        {images?.length > 0 ? (
          images?.map((image) => (
            <div className="w-36 h-32 rounded-2xl mr-2 relative">
              <div className="bg-lightBlue w-full h-full rounded-2xl relative">
                <Image
                  src={image}
                  fill
                  className="object-cover rounded-2xl hover:opacity-50 transition-opacity duration-300"
                  alt="Worker avatar"
                  onClick={() => handleImageClick(image)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No images yet</p>
        )}
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative">
            <button
              className="absolute top-0 right-0 m-4 text-white text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt={selectedImage.alt}
              className="max-w-full max-h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
