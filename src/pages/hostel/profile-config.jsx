import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { UserIcon, ListIcon, LockIcon, ServicesIcon } from "@/constants/icons";
import { useStore } from "@/store";

export default function HostelProfile() {
  const { user } = useStore();
  const router = useRouter();

  return (
    <div className="bg-white h-full w-screen py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <OptionCard
        title="My Services"
        subtitle="Abilities and skills"
        icon={ServicesIcon}
        check
        onClick={() => router.push("/hostel/my-services")}
      />
      <OptionCard
        title="About Me"
        subtitle="Gallery and description"
        icon={UserIcon}
        check
        onClick={() => router.push(`/hostel/edit/${user._id}`)}
      />
      <OptionCard
        title="My Schedules"
        subtitle="Set your calendar"
        icon={ListIcon}
        check
        onClick={() => router.push("/hostel/my-schedules")}
      />
      <OptionCard
        title="My Workplaces"
        subtitle="Establishments"
        icon={LockIcon}
        check
        onClick={() => router.push("/hostel/my-workplaces")}
      />
    </div>
  );
}
