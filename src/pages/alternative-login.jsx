import { useEffect, useState } from "react";
import Link from "next/link";

import AltLoginForm from "@/components/utils/forms/AltLoginForm";

import { Auth, Hub } from "aws-amplify";

export default function AlternativeLogin() {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    // const unsubscribe = Hub.listen("auth", (response) => {
    //   console.log(response);
    //   console.log(
    //     "-------------------------------------------------------------"
    //   );
    //   switch (event) {
    //     case "signIn":
    //       setUser(data);
    //       break;
    //     case "signOut":
    //       setUser(null);
    //       break;
    //     case "CustomOAuthState":
    //       setCustomState(data);
    //       break;
    //   }
    // });
    //getUser();
    // return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      console.log(currentUser);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    }
  };
  return (
    <div className="bg-white min-h-screen w-full flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-semibold text-2xl py-5">
        LOGIN TO SOS
      </h1>
      <h2 className="text-blackText pb-5">Choose one option</h2>
      <div className="w-full md:w-80">
        <AltLoginForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-blackText">
          Don’t have an account?
          <Link className="text-lightBlue ml-2" href={"/register"}>
            Register
          </Link>{" "}
        </p>
        <p className="text-xs mt-5">
          By joining, you agree to our{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            Terms of Service &nbsp;
          </Link>
          and our{" "}
          <Link href={"user-policy"} className="font-bold text-blackText">
            Use Policy.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-bold my-8">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
