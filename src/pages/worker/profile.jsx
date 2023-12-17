import { useRouter } from "next/router";

import Cookies from "js-cookie";
import { useEffect } from "react";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { signOut } from "next-auth/react";

export default function WorkerProfile({ user }) {
  const router = useRouter();
  const { setUser, setLoggedIn, setWorker } = useStore();
  useEffect(() => {
    document.title = "Profile - SOS Travelers";
  }, []);

  const logout = async () => {
    localStorage.removeItem("service");
    localStorage.removeItem("type");
    localStorage.removeItem("fromFavorite");
    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");
    Cookies.remove("service");

    localStorage.removeItem("type");
    setWorker(false);

    setUser(null);
    setLoggedIn(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="bg-white h-full w-screen py-20 lg:py-24 xl:py-24 px-5 md:pl-80 flex flex-col">
      <OutlinedButton
        text="Personal Details"
        onClick={() => router.push("/personal-details")}
      />
      <OutlinedButton
        text="Settings"
        onClick={() => router.push("/worker/settings")}
      />
      <OutlinedButton
        text="Worker Profile"
        onClick={() => router.push("/worker/profile-config")}
      />
      <OutlinedButton secondary text="Log Out" onClick={logout} />
    </div>
  );
}

// export async function getServerSideProps({ req }) {
//   console.log("weando2");
//   const redirect = {
//     redirect: {
//       destination: "/guest-settings",
//       permanent: false,
//     },
//   };
//   const userId = req.cookies["auth.user_id"];
//   if (!userId) return redirect;

//   let user = null;
//   try {
//     const response = await UserService.get(userId);
//     user = response.data;
//     if (!user) return redirect;
//   } catch (error) {
//     console.error(error);
//     return redirect;
//   }

//   return {
//     props: {
//       user: user,
//     },
//   };
// }
