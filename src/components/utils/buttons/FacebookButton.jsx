import React from "react";

import { FBIcon } from "@/constants/icons";

import { Auth } from "aws-amplify";
import { useSession, signIn, signOut } from "next-auth/react"
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

function FacebookButton() {
  const login = async() => {
    const result = await signIn('facebook',{callbackUrl: 'http://localhost:3000'});
    // Puedes manejar el resultado de la autenticación aquí
    if (result&&result.error) {
      console.error('Error al iniciar sesión:', result.error);
    }
  };
  return (
    <button
      className="bg-greyButton border-2 border-darkBlue text-black py-3 w-full rounded-xl my-2 flex items-center px-5"
      type="button"
      onClick={login}
    >
      <FBIcon />
      <p className="ml-5">Sign in with Facebook</p>
    </button>
  );
}

export default FacebookButton;
