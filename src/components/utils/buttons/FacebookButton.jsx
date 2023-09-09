import React from "react";

import { FBIcon } from "@/constants/icons";

import { Auth } from "aws-amplify";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

function FacebookButton() {
  const login = () => {
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };
  return (
    <button
      className="bg-fb text-blanco py-4 w-full rounded-xl my-2 flex flex-row items-center justify-center"
      type="button"
      onClick={login}
    >
      <FBIcon />
      <p className="ml-5">Sign in with Facebook</p>
    </button>
  );
}

export default FacebookButton;
