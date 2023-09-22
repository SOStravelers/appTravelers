import { useRouter } from "next/router";

import SolidButton from "@/components/utils/buttons/SolidButton";
import ProfileForm from "@/components/utils/forms/ProfileForm";

import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function Profile({ user }) {
  const router = useRouter();
  const { setUser, setLoggedIn } = useStore();

  const logout = async () => {
    localStorage.removeItem("auth.access_token");
    localStorage.removeItem("auth.refresh_token");
    localStorage.removeItem("auth.user_id");

    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");

    setUser({});
    setLoggedIn(false);

    router.push("/");
  };

  return (
    <div className="bg-white h-full w-screen p-10 mb-20">
      <ProfileForm />
      <SolidButton text="Settings" color="grey" />
      <SolidButton text="Invite Friend" color="verde" />
      <SolidButton text="Log Out" color="rojo" onClick={logout} />
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const redirect = {
    redirect: {
      destination: "/login",
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
