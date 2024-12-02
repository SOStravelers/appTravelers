import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";
import { useEffect } from "react";
// import { getSession } from "next-auth/react";
import { useStore } from "@/store";
import languageData from "@/language/login.json";
export default function Login() {
  const store = useStore();
  const { language } = store;
  useEffect(() => {
    document.title = "Login | SOS Travelers";
  }, []);

  return (
    <div className="bg-white h-full w-full flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">
        {languageData.login.title[language]}
      </h1>
      <h2 className="text-blackText py-5">
        {languageData.login.subtitle[language]}
      </h2>
      <div className="w-full md:w-80">
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-blackText">
          {languageData.login.new[language]}
          <Link className="text-black font-semibold  ml-2" href={"/register"}>
            {languageData.login.registerHere[language]}
          </Link>
        </p>
        <p className="text-xs mt-5">
          {languageData.login.byjoining[language]}{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            {languageData.login.terms[language]} &nbsp;
          </Link>
          {languageData.login.our[language]}{" "}
          <Link href={"use-policy"} className="font-bold text-blackText">
            {languageData.login.policy[language]}.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-semibold my-5">
            {languageData.login.skipNow[language]}
          </p>
        </Link>
      </div>
    </div>
  );
}
