import Image from "next/image";
import OutlinedButton from "../utils/buttons/OutlinedButton";

function Slide1({ setSlide }) {
  return (
    <div className="flex flex-col items-center px-10">
      <h1 className="text-black my-5 text-3xl">Book services with ease</h1>
      <p className="text-blackText text-center text-xl px-5">
        it includes services like haircut, massage, tattoo and much more.
      </p>
      <Image
        src={"/assets/slide1.png"}
        width={300}
        height={300}
        className="my-10"
        alt="Imagen Servicios"
      />
      <OutlinedButton onClick={() => setSlide(2)} text="Continue" />
    </div>
  );
}

export default Slide1;
