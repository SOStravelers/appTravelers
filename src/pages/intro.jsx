import { useState } from "react";
import clsx from "clsx";
import Slide1 from "@/components/intro/Slide1";
import Slide2 from "@/components/intro/Slide2";

export default function Intro() {
  const [slide, setSlide] = useState(1);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
      <div className="flex mb-20">
        <div
          className={clsx(
            "h-2 w-40 cursor-pointer rounded-xl mr-1",
            slide === 1 ? "bg-lightBlue" : "bg-lightGrey"
          )}
          onClick={() => setSlide(1)}
        ></div>
        <div
          className={clsx(
            "h-2 w-40 cursor-pointer rounded-xl ml-1",
            slide === 2 ? "bg-lightBlue" : "bg-lightGrey"
          )}
          onClick={() => setSlide(2)}
        ></div>
      </div>
      {slide === 1 ? <Slide1 setSlide={setSlide} /> : <Slide2 />}
    </div>
  );
}
