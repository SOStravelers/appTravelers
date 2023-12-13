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
import listByUser from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { useState, useEffect } from "react";
import { images } from "../../../next.config";
import schedule from "@/services/ScheduleService";

export default function WorkerProfile() {
  const { user, setUser } = useStore();
  const router = useRouter();

  const [mScheCheck, setMScheCheck] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const schedulesResponse = await schedule.getScheduleUser();
        const hasActiveSchedules = schedulesResponse.data.schedules.some(
          (item) => item.isActive === true
        );
        setMScheCheck(hasActiveSchedules);
        const response = await UserService.getUserById();
        const userData = response.data;
        // Actualiza la información del usuario en el estado global
        setUser(userData);
      } catch (error) {
        console.error("Error getting user: ", error);
      }
    };

    // Llama a la función cuando el componente se monta
    fetchUser();
  }, [mScheCheck]);

  let mServCheck;
  let mProfCheck;
  let lGallery = user?.img?.gallery.filter((item) => item !== null).length >= 3;

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
