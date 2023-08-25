import SolidButton from "../utils/buttons/SolidButton";

function Slide1({ setSlide }) {
  return (
    <div className="flex flex-col items-center px-10">
      <h1 className="text-negro my-5">Book services with ease</h1>
      <p className="text-negroTexto text-center w-3/4">
        it includes services like haircut, massage, tattoo and much more.
      </p>
      <div className="bg-negroTexto h-60 w-60 my-10"></div>
      <SolidButton onClick={() => setSlide(2)} text="Continue" />
    </div>
  );
}

export default Slide1;
