import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";

export default function Login() {
  return (
    <div className="bg-white h-full w-full flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">WELCOME BACK</h1>
      <h2 className="text-blackText py-5">Get back to account</h2>
      <div className="w-full md:w-80">
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-blackText">
          Are you a new member?
          <Link className="text-lightBlue ml-2" href={"/register"}>
            Register
          </Link>
        </p>
        <Link href="/alternative-login">
          <p className="text-lightBlue my-5">
            <span className="text-blackText">Or </span>sign in with other
            options
          </p>
        </Link>
        <p className="text-xs">
          By joining, you agree to our{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            Terms of Service.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-semibold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
