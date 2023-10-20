import React from "react";

import { Auth } from "aws-amplify";
import { useSession, signIn, signOut } from "next-auth/react";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { GoogleIcon } from "@/constants/icons";
import { ca } from "date-fns/locale";

function GoogleButton() {
  const login = async () => {
    const result = await signIn("google", {
      callbackUrl: "https://app-travelers.vercel.app/login",
    });
    // Puedes manejar el resultado de la autenticación aquí
    if (result && result.error) {
      console.error("Error al iniciar sesión:", result.error);
    } else {
      console.log("todo bien");
    }
  };
  return (
    <button
      className="bg-greyButton border-2 border-darkBlue text-black py-3 w-full rounded-xl my-2 flex items-center px-5"
      type="button"
      onClick={login}
    >
      <GoogleIcon />
      <p className="ml-5">Continue with Google</p>
    </button>
  );
}

export default GoogleButton;
