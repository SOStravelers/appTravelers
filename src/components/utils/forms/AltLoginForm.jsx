import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput text="Apple" />
      <OutlinedInput text="Google" />
      <OutlinedInput text="Facebook" />
      <SolidButton text="Sign in with you email" />
    </form>
  );
}

export default LoginForm;
