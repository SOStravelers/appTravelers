import Link from "next/link";
import RegisterForm from "@/components/utils/forms/RegisterForm";

export default function registro() {
  return (
    <div className="bg-blanco w-screen min-h-screen px-10">
      <h1 className="text-negroTexto font-bold text-2xl py-5">REGISTER</h1>
      <h2 className="text-negroTexto py-5">Fill the following details</h2>
      <RegisterForm />
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-negroTexto">
          Already a member?
          <Link className="text-azul ml-2" href={"/login"}>
            Login
          </Link>{" "}
        </p>
        <Link href="/">
          <p className="text-negro font-bold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
