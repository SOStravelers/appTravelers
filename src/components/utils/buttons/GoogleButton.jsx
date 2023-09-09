import React from "react";

import { Auth } from "aws-amplify";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { GoogleIcon } from "@/constants/icons";

function GoogleButton() {
  const login = () => {
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };
  return (
    <button
      className="bg-google py-4 w-full rounded-xl my-2 flex flex-row items-center justify-center"
      type="button"
      onClick={login}
    >
      <GoogleIcon />
      <p className="ml-5">Sign in with Google</p>
    </button>
  );
}

export default GoogleButton;
