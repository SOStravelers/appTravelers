import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import { UserIcon, ListIcon, LockIcon, ServicesIcon } from "@/constants/icons";
import { useStore } from "@/store";
import listByUser from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { useState, useEffect } from "react";
import { images } from "../../../next.config";

export default function WorkerProfile() {
  const { user, setUser } = useStore();
  const router = useRouter();
  let mServCheck;
  let mProfCheck;
  let mScheCheck;
  let lGallery = user?.img?.gallery.some((item) => item !== null);

  if (user?.workerData?.services?.length > 0) {
    mServCheck = true;
  } else {
    mServCheck = false;
  }
  if (user?.about !== "" && lGallery) {
    mProfCheck = true;
  } else {
    mProfCheck = false;
  }

  return (
    <div className="bg-white h-full w-screen py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <OptionCard
        title="My Services"
        subtitle="Abilities and skills"
        icon={ServicesIcon}
        check={mServCheck}
        onClick={() => router.push("/worker/my-services")}
      />
      <OptionCard
        title="About Me"
        subtitle="Gallery and description"
        icon={UserIcon}
        check={mProfCheck}
        onClick={() => router.push(`/worker/edit/${user._id}`)}
      />
      <OptionCard
        title="My Schedules"
        subtitle="Set your calendar"
        icon={ListIcon}
        check={mScheCheck}
        onClick={() => router.push("/worker/my-schedules") && console.log()}
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
