import Link from "next/link";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <OutlinedInput text="Full Name" />
      <OutlinedInput text="Password" />
      <Link href="/register">
        <p className="text-negroTexto font-bold my-5 text-right">
          {" "}
          Forgot password?
        </p>
      </Link>
      <Link href="/">
        <SolidButton text="Login" />
      </Link>
    </form>
  );
}

export default LoginForm;
