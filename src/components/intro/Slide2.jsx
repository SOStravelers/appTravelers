import Link from "next/link";
import SolidButton from "../utils/buttons/SolidButton";

function Slide2() {
  return (
    <div className="flex flex-col items-center px-10">
      <h1 className="text-negro my-5">Offer Own Services</h1>
      <p className="text-negroTexto text-center w-3/4">
        If you are worker then you can own offer services & get paid.
      </p>
      <div className="bg-negroTexto h-60 w-60 my-10"></div>
      <Link href={"/"} className="w-full">
        <SolidButton text="Let's go" />
      </Link>
    </div>
  );
}

export default Slide2;
