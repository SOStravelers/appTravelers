import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { UserIcon, MailIcon, HouseIcon, LockIcon } from "@/constants/icons";
import { useStore } from "@/store";

export default function PersonalDetails() {
  const router = useRouter();
  const { user, setUser, setLoggedIn } = useStore();
  console.log("wena", user);
  return (
    <div className="flex flex-col justify-center py-28 px-5 md:pl-80">
      <OptionCard title="Name" icon={UserIcon} subtitle="Ricardo Cid" />
      <OptionCard
        title="Email"
        icon={MailIcon}
        subtitle="sostravelbr@gmail.com"
      />
      <OptionCard title="Address" icon={HouseIcon} subtitle="Miro One Hotel" />
      {user.security && user.security.hasPassword ? (
        // Este componente se mostrará si el usuario está autenticado
        <OptionCard
          title="Change Password"
          icon={LockIcon}
          onClick={() => router.push("/change-password")}
        />
      ) : (
        // Este componente se mostrará si el usuario no está autenticado
        <OptionCard
          title="Create Password"
          icon={LockIcon}
          onClick={() => router.push("/create-password")}
        />
      )}
    </div>
  );
}
