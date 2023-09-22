import React from "react";

function Gallery() {
  return (
    <div className="my-5">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        Gallery
      </h1>
      <div className="grid grid-cols-2 gap-1">
        <div className="w-full h-28 rounded-xl bg-transparentBlue"></div>
        <div className="w-full h-28 rounded-xl bg-transparentBlue"></div>
        <div className="w-full h-28 rounded-xl bg-transparentBlue"></div>
        <div className="w-full h-28 rounded-xl bg-transparentBlue"></div>
      </div>
    </div>
  );
}

export default Gallery;
