import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";

export default function Login() {
  return (
    <div className="bg-blanco h-full w-screen px-10">
      <h1 className="text-negroTexto font-bold text-2xl py-5">WELCOME BACK</h1>
      <h2 className="text-negroTexto py-5">Get back to account</h2>
      <LoginForm />
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-negroTexto">
          Are you a new member?
          <Link className="text-azul ml-2" href={"/register"}>
            Register
          </Link>
        </p>
        <Link href="/alternative-login">
          <p className="text-azul font-bold my-5">Sing in with other options</p>
        </Link>
        <Link href="/">
          <p className="text-negro font-bold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
