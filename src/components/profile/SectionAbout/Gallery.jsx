import React from "react";

import { useState } from "react";

function Gallery({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const images = [];
    for (let i = 0; i < files.length && i < 6; i++) {
      images.push(URL.createObjectURL(files[i]));
    }
    setSelectedImages(images);
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
          images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={image.alt}
              className="w-full h-28 rounded-xl bg-transparentBlue cursor-pointer"
              onClick={() => handleImageClick(image)}
            />
          ))
        ) : (
          <>
            <label
              htmlFor="image-upload"
              className="w-full flex justify-center items-center h-28 rounded-xl bg-grey text-white text-3xl cursor-pointer"
            >
              +
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {selectedImages.length > 0 &&
              selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-28 rounded-xl bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <button
                    className="absolute top-0 right-0 h-8 w-8 flex justify-center items-center m-1 rounded-full bg-white text-black text-2xl"
                    onClick={() => {
                      const images = [...selectedImages];
                      images.splice(index, 1);
                      setSelectedImages(images);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </>
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
