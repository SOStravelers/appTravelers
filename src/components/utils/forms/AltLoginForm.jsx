import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput text="Apple" />
      <OutlinedInput text="Google" />
      <OutlinedInput text="Facebook" />
      <Link href="/login">
        <SolidButton text="Sign in with you email" />
      </Link>
    </form>
  );
}

export default LoginForm;
