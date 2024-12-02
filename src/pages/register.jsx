import Link from "next/link";
import RegisterForm from "@/components/utils/forms/RegisterForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import languageData from "@/language/login.json";
export default function Registro() {
  const store = useStore();
  const { language } = store;
  useEffect(() => {
    document.title = "Register | SOS Travelers";
  }, []);
  return (
    <div className="bg-white w-full minh-screen flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">
        {languageData.register.title[language]}
      </h1>
      <h2 className="text-blackText pb-5">
        {" "}
        {languageData.register.subtitle[language]}
      </h2>
      <div className="w-full md:w-80">
        <RegisterForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <p className="text-blackText">
          {languageData.register.account[language]}
          <Link className="text-black font-semibold ml-2" href={"/login"}>
            {languageData.register.login[language]}
          </Link>{" "}
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
          <p className="text-black font-bold my-5">
            {" "}
            {languageData.login.skipNow[language]}
          </p>
        </Link>
      </div>
    </div>
  );
}
