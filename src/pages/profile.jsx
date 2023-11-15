import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { signOut } from "next-auth/react";

export default function Profile({ user }) {
  const router = useRouter();
  const { setUser, setLoggedIn } = useStore();

  const logout = async () => {
    localStorage.removeItem("auth.access_token");
    localStorage.removeItem("auth.refresh_token");
    localStorage.removeItem("auth.user_id");
    localStorage.removeItem("auth.user");
    localStorage.removeItem("service");
    localStorage.removeItem("type");
    localStorage.removeItem("next-auth.session-token");

    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");
    Cookies.remove("auth.user");
    Cookies.remove("service");
    Cookies.remove("next-auth.session-token");

    setUser({});
    setLoggedIn(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="bg-white h-full flex flex-col w-screen py-28 px-5 md:pl-80">
      <OutlinedButton
        text="Personal Details"
        onClick={() => router.push("/personal-details")}
      />
      <OutlinedButton
        text="Settings"
        onClick={() => router.push("/settings")}
      />
      <OutlinedButton text="Invite Friends" />
      <OutlinedButton secondary text="Log Out" onClick={logout} />
    </div>
  );
}

export async function getServerSideProps({ req }) {
  console.log("weando");
  const redirect = {
    redirect: {
      destination: "/guest-settings",
      permanent: false,
    },
  };
  const userId = req.cookies["auth.user_id"];
  if (!userId) return redirect;

  let user = null;
  // try {
  //   const response = await UserService.get(userId);
  //   user = response.data;
  //   if (!user) return redirect;
  // } catch (error) {
  //   console.error(error);
  //   return redirect;
  // }

  return {
    props: {
      user: user,
    },
  };
}
