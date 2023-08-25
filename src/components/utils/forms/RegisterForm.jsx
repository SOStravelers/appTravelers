import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function RegisterForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput text="Full Name" />
      <OutlinedInput text="Email Address" />
      <OutlinedInput text="Password" />
      <OutlinedInput text="Confirm Password" />
      <Link href="/">
        <p className="text-negroTexto font-bold my-5 text-right">
          {" "}
          Forgot password?
        </p>
      </Link>
      <SolidButton text="Register" />
    </form>
  );
}

export default RegisterForm;
