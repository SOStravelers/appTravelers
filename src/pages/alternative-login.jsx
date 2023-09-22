import Link from "next/link";
import AltLoginForm from "@/components/utils/forms/AltLoginForm";

export default function AlternativeLogin() {
  return (
    <div className="bg-white w-screen min-h-screen px-10">
      <h1 className="text-blackText font-semibold text-2xl py-5">
        LOGIN TO SOS
      </h1>
      <h2 className="text-blackText pb-5">Choose one option</h2>
      <AltLoginForm />
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-blackText">
          Don’t have an account?
          <Link className="text-lightBlue ml-2" href={"/register"}>
            Register
          </Link>{" "}
        </p>
        <p className="text-xs mt-5">
          By joining, you agree to our{" "}
          <Link href={"terms"} className="font-bold text-blackText">
            Terms of Service.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-bold my-8">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
