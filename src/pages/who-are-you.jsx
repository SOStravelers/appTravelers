import Image from "next/image";
import Logo from "@/assets/logo.png";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

export default function WhoAreYou() {
  return (
    <section className="h-screen w-screen flex flex-col items-center justify-center bg-blanco px-10">
      <Image className="mb-10" src={Logo} alt="logo" />
      <h1 className="text-negroTexto font-bold text-2xl my-10">Who are you?</h1>
      <SolidButton text="User" />
      <OutlinedButton text="Worker" />
    </section>
  );
}
