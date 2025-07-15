import React from "react";
import { useStore } from "/src/store/index";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { GoogleIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { FcGoogle } from "react-icons/fc";

function GoogleButton() {
  const router = useRouter();
  const login = async () => {
    const { front } = useStore.getState().urls;
    const result = await signIn("google", {
      callbackUrl: window.location.href,
    });
    // Puedes manejar el resultado de la autenticación aquí
    if (result && result.error) {
      console.error("Error al iniciar sesión:", result.error);
    }
  };
  return (
    // <button
    //   className=" max-w-lg text-sm lg:text-lg rounded-full py-1 w-3/4 mx-auto cursor-pointer bg-gray-200  text-black my-2 flex justify-center items-center px-1"
    //   type="button"
    //   onClick={login}
    // >
    //   <GoogleIcon />
    //   <p className=" text-md">Continue with Google</p>
    // </button>

    <OutlinedButton
      text="Continue with Google"
      icon={FcGoogle}
      textColor="text-white"
      // dark="darkHeavy"
      buttonCenter={true}
      textSize="text-xs"
    />
  );
}

export default GoogleButton;
