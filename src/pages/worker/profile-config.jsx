import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { UserIcon, ListIcon, LockIcon } from "@/constants/icons";

export default function WorkerProfile() {
  // const getCookieValue = (name) => {
  //   const cookies = document.cookie.split("; ");
  //   for (const cookie of cookies) {
  //     const [cookieName, cookieValue] = cookie.split("=");
  //     if (cookieName === name) {
  //       return cookieValue;
  //     }
  //   }
  //   return null;
  // };

  // const userId = getCookieValue("auth.user_id");
  const router = useRouter();

  return (
    <div className="bg-white h-full w-screen p-5 mb-20">
      <OptionCard
        title="My Services"
        subtitle="Abilities and skills"
        icon={UserIcon}
        check
        onClick={() => router.push("/worker/my-services")}
      />
      <OptionCard
        title="About Me"
        subtitle="Gallery and description"
        icon={UserIcon}
        check
        onClick={() => router.push(`/worker/edit/${userId}`)}
      />
      <OptionCard
        title="My Schedules"
        subtitle="Set your calendar"
        icon={ListIcon}
        check
        onClick={() => router.push("/worker/my-schedules")}
      />
      <OptionCard
        title="My Tools"
        subtitle="Instruments and devices"
        icon={ListIcon}
        check
        onClick={() => router.push("/worker/my-tools")}
      />
      <OptionCard
        title="My Workplaces"
        subtitle="Establishments"
        icon={LockIcon}
        check
        onClick={() => router.push("/worker/my-workplaces")}
      />
    </div>
  );
}
