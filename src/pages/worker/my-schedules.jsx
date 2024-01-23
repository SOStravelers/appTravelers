import { useEffect, useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionWeek from "@/components/mySchedules/SectionWeek";
import SectionCalendar from "@/components/mySchedules/SectionCalendar";
import { SECTION_ONE } from "@/constants";
import { useStore } from "@/store";
export default function MySchedules() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const { isWorker } = useStore();

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <SwitchButtons
        titleOne={isWorker ? "Meu Horario" : "My Schedule"}
        titleTwo={isWorker ? "Feriados" : "Holidays"}
        setActualView={setActualView}
        actualView={actualView}
      />
      {actualView === SECTION_ONE ? <SectionWeek /> : <SectionCalendar />}
    </div>
  );
}
