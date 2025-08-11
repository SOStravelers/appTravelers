import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { signOut } from "next-auth/react";
import languageData from "@/language/routeTitles.json";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Profile({ user }) {
  useEffect(() => {
    document.title = "Profile | SOS Travelers";
  }, []);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  const router = useRouter();
  const { setUser, setLoggedIn, setWorker, language } = useStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);
  const logout = async () => {
    localStorage.removeItem("service");
    localStorage.removeItem("type");
    localStorage.removeItem("fromFavorite");
    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");
    Cookies.remove("service");
    Cookies.remove("user");
    setWorker(false);
    setUser({});
    setLoggedIn(false);
    await signOut({ redirect: false });

    router.push("/");
  };

  return (
    <div
      className={`min-h-screen bg-backgroundP pt-4 px-6  flex flex-col items-center
              transform transition-all duration-800 ease-out
              transition-opacity duration-800 ease-out
             ${loading ? opacityAnimation : displayAnimation}
            `}
    >
      <div className="w-full max-w-md flex flex-col self-center">
        <OutlinedButton
          onClick={() => router.push("/personal-details")}
          text={languageData.personalDetails[language]}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          centerWide
          margin="mb-3"
        />

        <OutlinedButton
          onClick={() => router.push("/settings")}
          text={languageData.settings[language]}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          centerWide
          margin="mb-3"
        />

        <OutlinedButton
          onClick={logout}
          text={languageData.logOut[language]}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          centerWide
        />
      </div>
    </div>
  );
}
