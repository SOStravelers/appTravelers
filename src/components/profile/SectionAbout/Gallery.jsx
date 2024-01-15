import { useState } from "react";
import Image from "next/image";
import { random } from "@/lib/utils";

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

  const handlePrevImage = () => {
    const index = images.indexOf(selectedImage);
    const lastIndex = images.length - 1;

    if (index === 0) {
      setSelectedImage(images[lastIndex]);
    } else {
      setSelectedImage(images[index - 1]);
    }
  };

  const handleNextImage = () => {
    const index = images.indexOf(selectedImage);
    const lastIndex = images.length - 1;

    if (index === lastIndex) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage(images[index + 1]);
    }
  };

  return (
    <div className="my-5 ">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        Gallery
      </h1>
      <div className="grid grid-cols-2 gap-1 w-full max-w-lg">
        {images?.length > 0 ? (
          images?.map((image, index) => (
            <div key={index} className="rounded-2xl mr-2 relative">
              <div
                style={{
                  // paddingTop: "56.25%", // 16:9 Aspect Ratio
                  paddingTop: "100%", // 1:1 Aspect Ratio
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: !image ? "none" : "block",
                }}
                className="bg-blueBorder  w-full h-full rounded-2xl relative"
              >
                <Image
                  src={image + "?hola=" + random()}
                  fill
                  className="object-cover rounded-2xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                  alt=" avatar"
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
              style={{ color: "#00A0D5" }}
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <button
              className="absolute top-48 left-0 m-4 text-white text-7xl"
              style={{ color: "#00A0D5" }}
              onClick={() => handlePrevImage()}
            >
              {"<"}
            </button>

            <button
              className="absolute top-48 right-0 m-4 text-white text-7xl"
              style={{ color: "#00A0D5" }}
              onClick={() => handleNextImage()}
            >
              {">"}
            </button>
            <img
              src={selectedImage}
              alt={selectedImage.alt}
              className="max-w-full max-h-full md:w-[50vw] md:h-[50vh] object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
