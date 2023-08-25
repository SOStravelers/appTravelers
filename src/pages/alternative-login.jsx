import Link from "next/link";
import AltLoginForm from "@/components/utils/forms/AltLoginForm";

export default function AlternativeLogin() {
  return (
    <div className="bg-blanco w-screen min-h-screen px-10">
      <h1 className="text-negroTexto font-bold text-2xl py-5">LOGIN TO SOS</h1>
      <h2 className="text-negroTexto py-5">Choose one option</h2>
      <AltLoginForm />
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-negroTexto">
          Don’t have an account?
          <Link className="text-azul ml-2" href={"/register"}>
            Register
          </Link>{" "}
        </p>
        <Link href="/">
          <p className="text-negro font-bold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
