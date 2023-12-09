import React from "react";
import { useStore } from "/src/store/index";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { GoogleIcon } from "@/constants/icons";

function GoogleButton() {
  const router = useRouter();
  const login = async () => {
    const { front } = useStore.getState().urls;
    const result = await signIn("google");
    // Puedes manejar el resultado de la autenticación aquí
    if (result && result.error) {
      console.error("Error al iniciar sesión:", result.error);
    }
  };
  return (
    <button
      className="border-2 border-solid max-w-lg text-lg lg:text-lg rounded-xl py-3 w-full cursor-pointer bg-greyButton border-darkBlue text-black rounded-xl my-2 flex justify-center items-center px-3"
      type="button"
      onClick={login}
    >
      <GoogleIcon />
      <p className="ml-1  text-base ">Continue with Google</p>
    </button>
  );
}

export default GoogleButton;
