import Link from "next/link";
import Image from "next/image";
import SolidButton from "../utils/buttons/SolidButton";
import slide2 from "../../../public/assets/slide2.png";

function Slide2() {
  return (
    <div className="flex flex-col items-center px-10">
      <h1 className="text-negro my-5 text-3xl">Offer Own Services</h1>
      <p className="text-negroTexto text-center text-xl px-5">
        If you are worker then you can own offer services & get paid.
      </p>
      <Image
        src={slide2}
        width={300}
        height={300}
        className="my-10"
        alt="Imagen Provedores"
      />
      <Link href={"/"} className="w-full">
        <SolidButton text="Let's go" />
      </Link>
    </div>
  );
}

export default Slide2;
