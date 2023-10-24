import { useRouter } from "next/router";

import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

export default function WorkerProfile({ user }) {
  console.log(user);
  const router = useRouter();
  const { setUser, setLoggedIn } = useStore();

  const logout = async () => {
    localStorage.removeItem("auth.access_token");
    localStorage.removeItem("auth.refresh_token");
    localStorage.removeItem("auth.user_id");
    localStorage.removeItem("auth.user");

    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");
    Cookies.remove("auth.user");

    setUser({});
    setLoggedIn(false);

    router.push("/");
  };

  return (
    <div className="bg-white h-full w-screen py-28 px-5 md:pl-80 flex flex-col">
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

export async function getServerSideProps({ req }) {
  const redirect = {
    redirect: {
      destination: "/guest-settings",
      permanent: false,
    },
  };
  const userId = req.cookies["auth.user_id"];
  if (!userId) return redirect;

  let user = null;
  try {
    const response = await UserService.get(userId);
    user = response.data;
    if (!user) return redirect;
  } catch (error) {
    console.error(error);
    return redirect;
  }

  return {
    props: {
      user: user,
    },
  };
}
