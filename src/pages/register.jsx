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
  const router = useRouter();
  const { language } = store;
  useEffect(() => {
    document.title = "Register | SOS Travelers";
  }, []);
  return (
    <div
      className="bg-backgroundP w-full minh-screen flex flex-col md:items-center px-10"
      style={{ marginTop: "-60px" }}
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
          className="text-textColor font-bold my-5 cursor-pointer"
        >
          {languageData.login.skipNow[language]}
        </p>
      </div>
    </div>
  );
}
