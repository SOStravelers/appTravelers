import React from "react";
import Link from "next/link";
import LoginForm from "@/components/utils/forms/LoginForm";
import { useState, useEffect } from "react";
// import { getSession } from "next-auth/react";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { useStore } from "@/store";
import languageData from "@/language/login.json";
export default function Login() {
  const store = useStore();
  const { language } = store;
  const [loading, setLoading] = useState(true); // <-- loading flag
  useEffect(() => {
    document.title = "Login | SOS Travelers";
  }, []);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  return (
    <div
      className={`bg-backgroundP w-full flex flex-col md:items-center px-10
    transition-all duration-800 ease-out
    ${loading ? opacityAnimation : displayAnimation}`}
      // style={{ minHeight: "calc(100vh - 60px)", marginTop: "-60px" }}
    >
      <h1 className="text-textColor font-bold text-2xl my-1">
        {languageData.login.title[language]}
      </h1>
      <h2 className="text-textColorGray mb-3">
        {languageData.login.subtitle[language]}
      </h2>
      <div className="w-full md:w-80">
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-textColorGray">
          {languageData.login.new[language]}
          <Link
            className="ttext-textColor font-semibold  ml-2"
            href={"/register"}
          >
            {languageData.login.registerHere[language]}
          </Link>
        </p>
        <p className="text-xs text-textColorGray mt-5">
          {languageData.login.byjoining[language]}{" "}
          <Link href={"terms-of-service"} className="font-bold text-textColor">
            {languageData.login.terms[language]} &nbsp;
          </Link>
          {languageData.login.our[language]}{" "}
          <Link href={"use-policy"} className="font-bold text-textColor">
            {languageData.login.policy[language]}.
          </Link>
        </p>
        <Link href="/">
          <p className="text-textColor font-semibold mt-5">
            {languageData.login.skipNow[language]}
          </p>
        </Link>
      </div>
    </div>
  );
}
