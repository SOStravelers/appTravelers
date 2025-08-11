import Link from "next/link";
import RegisterForm from "@/components/utils/forms/RegisterForm";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import languageData from "@/language/login.json";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Registro() {
  const store = useStore();
  const router = useRouter();
  const { language } = store;
  const [loading, setLoading] = useState(true); // <-- loading flag
  useEffect(() => {
    document.title = "Register | SOS Travelers";
  }, []);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);
  return (
    <div
      className={`px-10 flex flex-col md:items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      <h1 className="text-textColor font-bold text-2xl mb-3">
        {languageData.register.title[language]}
      </h1>
      {/* <h2 className="text-textColor pb-5">
        {" "}
        {languageData.register.subtitle[language]}
      </h2> */}
      <div className="w-full md:w-80">
        <RegisterForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <p className="text-textColor">
          {languageData.register.account[language]}
          <Link className="text-textColor font-semibold ml-2" href={"/login"}>
            {languageData.register.login[language]}
          </Link>{" "}
        </p>
        <p className="text-xs text-textColor mt-5">
          {languageData.login.byjoining[language]}{" "}
          <Link href={"terms-of-service"} className="font-bold text-textColor">
            {languageData.login.terms[language]} &nbsp;
          </Link>
          {languageData.login.our[language]}{" "}
          <Link href={"use-policy"} className="font-bold text-textColor">
            {languageData.login.policy[language]}.
          </Link>
        </p>
        <p
          onClick={() => router.back()}
          className="text-textColor font-bold cursor-pointer mt-5"
        >
          {languageData.login.skipNow[language]}
        </p>
      </div>
    </div>
  );
}
