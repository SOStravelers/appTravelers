import { useEffect, useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionWeek from "@/components/mySchedules/SectionWeek";
import SectionCalendar from "@/components/mySchedules/SectionCalendar";
import { SECTION_ONE } from "@/constants";

export default function MySchedules() {
  /* const fetchUser = async () => {
    try {
      const schedulesResponse = await schedule.getScheduleUser();
      const hasActiveSchedules = schedulesResponse.data.schedules.some(
        (item) => item.isActive === true
      );
      setMScheCheck(hasActiveSchedules);
      const newUser = { ...user };
      console.log("el name", newUser);
      if (isWorkerCheck == true) {
        newUser.workerData.isCheck = true;
        const response = await UserService.updateUser(newUser);
        setUser(response.data);
        console.log("después de actualizar el estado:", response.data);

        //  console.log("ischeck:", response.workerData.isCheck);
      } else {
        newUser.workerData.isCheck = false;
        const response = await UserService.updateUser(newUser);
        setUser(response.data);
        console.log("después de actualizar el estado:", response.data);
      }
      // Actualiza la información del usuario en el estado global
    } catch (error) {
      console.error("Error getting user: ", error);
    }
  }; */

  const [actualView, setActualView] = useState(SECTION_ONE);

  return (
    <section className="flex flex-col items-center md:items-start py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <SwitchButtons
        titleOne={"My Schedule"}
        titleTwo={"Holidays"}
        setActualView={setActualView}
        actualView={actualView}
      />
      {actualView === SECTION_ONE ? <SectionWeek /> : <SectionCalendar />}
    </section>
  );
}
