import Image from "next/image";
import SolidButton from "../utils/buttons/SolidButton";
import slide1 from "../../../public/assets/slide1.png";

function Slide1({ setSlide }) {
  return (
    <div className="flex flex-col items-center px-10">
      <h1 className="text-negro my-5 text-3xl">Book services with ease</h1>
      <p className="text-negroTexto text-center text-xl px-5">
        it includes services like haircut, massage, tattoo and much more.
      </p>
      <Image
        src={slide1}
        width={300}
        height={300}
        className="my-10"
        alt="Imagen Servicios"
      />
      <SolidButton onClick={() => setSlide(2)} text="Continue" />
    </div>
  );
}

export default Slide1;
