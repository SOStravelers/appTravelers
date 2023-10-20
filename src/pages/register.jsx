import Link from "next/link";
import RegisterForm from "@/components/utils/forms/RegisterForm";

export default function Registro() {
  return (
    <div className="bg-white w-full minh-screen flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">REGISTER</h1>
      <h2 className="text-blackText pb-5">Fill the following details</h2>
      <div className="w-full md:w-80">
        <RegisterForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <p className="text-blackText">
          Already a member?
          <Link className="text-lightBlue ml-2" href={"/login"}>
            Login
          </Link>{" "}
        </p>
        <p className="text-xs mt-3">
          By joining, you agree to our{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            Terms of Service.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-bold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
