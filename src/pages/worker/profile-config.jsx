import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import {
  UserIcon,
  ListIcon,
  LockIcon,
  ServicesIcon,
  CheckBoxesPicture,
  CertificationPicture,
} from "@/constants/icons";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";

export default function WorkerProfile() {
  const { user, setUser } = useState(null);
  const router = useRouter();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const newuser = UserService.getUserById();
    let mServCheck = user?.workerData?.isMyServicesOk;
    let mProfCheck = user?.workerData?.isAboutmeOk;
    let mScheCheck = user?.workerData?.isMySchedulesOk;
    let mPlacCheck = user?.workerData?.isMyWorkplacesOk; //true por defecto, se debe corregir
  };

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
        check={mPlacCheck}
        onClick={() => router.push("/worker/my-workplaces")}
      />
      <div className="max-w-lg text-center text-xl my-5 flex flex-col justify-center">
        <CheckBoxesPicture className="" />
        <p className="text-center text-sm italic">
          To be a validated worker, complete all the fields above
        </p>
        <CertificationPicture className="lg:pl-20 xl:ml-20 " />
        <p className="text-center mt-4 text-sm italic">
          You have been Validated!!, now you are ready to start working,
          remember to have your profile updated to receive better jobs
        </p>
      </div>
    </div>
  );
}
