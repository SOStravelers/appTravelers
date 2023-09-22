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
