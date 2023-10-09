import React from "react";

function Gallery({ images }) {
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
                />
              </div>
            </div>
          ))
        ) : (
          <p>No images yet</p>
        )}
      </div>
    </div>
  );
}

export default Gallery;
