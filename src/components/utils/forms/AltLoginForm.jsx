import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import FacebookButton from "@/components/utils/buttons/FacebookButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <FacebookButton />
      <GoogleButton />
      <Link href="/login">
        <SolidButton text="Sign in with you email" />
      </Link>
    </form>
  );
}

export default LoginForm;
