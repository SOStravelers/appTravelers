import { useRouter } from "next/router";

import SolidButton from "@/components/utils/buttons/SolidButton";
import ProfileForm from "@/components/utils/forms/ProfileForm";

import Cookies from "js-cookie";

export default function Profile() {
  const router = useRouter();

  const logout = async () => {
    localStorage.removeItem("auth.access_token");
    localStorage.removeItem("auth.refresh_token");
    localStorage.removeItem("auth.user_id");

    Cookies.remove("auth.access_token");
    Cookies.remove("auth.refresh_token");
    Cookies.remove("auth.user_id");

    router.push("/");
  };

  return (
    <div className="bg-blanco h-full w-screen p-10 mb-20">
      <ProfileForm />
      <SolidButton text="Settings" color="gris" />
      <SolidButton text="Invite Friend" color="verde" />
      <SolidButton text="Log Out" color="rojo" onClick={logout} />
    </div>
  );
}
