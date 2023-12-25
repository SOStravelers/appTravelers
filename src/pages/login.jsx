import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";
import { useEffect } from "react";
// import { getSession } from "next-auth/react";

export default function Login() {
  useEffect(() => {
    document.title = "Login - SOS Travelers";
  }, []);

  return (
    <div className="bg-white h-full w-full flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">WELCOME BACK</h1>
      <h2 className="text-blackText py-5">Get back to account</h2>
      <div className="w-full md:w-80">
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-blackText">
          Are you a new?
          <Link className="text-black font-semibold  ml-2" href={"/register"}>
            Register Here!
          </Link>
        </p>
        <p className="text-xs mt-5">
          By joining, you agree to our{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            Terms of Service &nbsp;
          </Link>
          and our{" "}
          <Link href={"use-policy"} className="font-bold text-blackText">
            Use Policy.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-semibold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
