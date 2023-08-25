import { useState } from "react";
import Slide1 from "@/components/intro/Slide1";
import Slide2 from "@/components/intro/Slide2";

export default function intro() {
  const [slide, setSlide] = useState(1);
  return (
    <div className="h-screen w-screen bg-blanco">
      {slide === 1 ? <Slide1 setSlide={setSlide} /> : <Slide2 />}
    </div>
  );
}
