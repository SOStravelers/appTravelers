import Link from "next/link";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import FacebookButton from "@/components/utils/buttons/FacebookButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

function LoginForm() {
  return (
    <form className="w-full flex flex-col">
      <FacebookButton />
      <GoogleButton />
      <Link href="/login" className="mt-5">
        <OutlinedButton text="Sign in with you email" />
      </Link>
    </form>
  );
}

export default LoginForm;
