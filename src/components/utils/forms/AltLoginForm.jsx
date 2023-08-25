import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput text="Full Name" />
      <OutlinedInput text="Email Address" />
      <OutlinedInput text="Password" />
      <OutlinedInput text="Confirm Password" />
      <SolidButton text="Sign in with you email" />
    </form>
  );
}

export default LoginForm;
