import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { UserIcon, MailIcon, HouseIcon, LockIcon } from "@/constants/icons";

export default function PersonalDetails() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center px-10 py-5">
      <OptionCard title="Name" icon={UserIcon} subtitle="Ricardo Cid" />
      <OptionCard
        title="Email"
        icon={MailIcon}
        subtitle="sostravelbr@gmail.com"
      />
      <OptionCard title="Address" icon={HouseIcon} subtitle="Miro One Hotel" />
      <OptionCard
        title="Change Password"
        icon={LockIcon}
        onClick={() => router.push("/change-password")}
      />
    </div>
  );
}
