import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { signOut } from "next-auth/react";
import languageData from "@/language/routeTitles.json";

export default function Profile({ user }) {
  useEffect(() => {
    document.title = "Profile | SOS Travelers";
  }, []);
  const router = useRouter();
  const { setUser, setLoggedIn, setWorker, language } = useStore();
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
    setWorker(false);
    setLoggedIn(false);
    await signOut({ redirect: false });

    setUser(null);
    router.push("/");
  };

  return (
    <div className="bg-white h-full flex flex-col w-screen py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <OutlinedButton
        text={languageData.personalDetails[language]}
        onClick={() => router.push("/personal-details")}
      />
      <OutlinedButton
        text={languageData.settings[language]}
        onClick={() => router.push("/settings")}
      />
      {/* <OutlinedButton text="Invite Friends" /> */}
      <OutlinedButton
        secondary
        text={languageData.logOut[language]}
        onClick={logout}
      />
    </div>
  );
}

// export async function getServerSideProps({ req }) {
//   console.log("weando");
//   const redirect = {
//     redirect: {
//       destination: "/guest-settings",
//       permanent: false,
//     },
//   };
//   const userId = req.cookies["auth.user_id"];
//   if (!userId) return redirect;

//   let user = null;
//   return {
//     props: {
//       user: user,
//     },
//   };
// }
