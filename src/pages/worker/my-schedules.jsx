import { useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionWeek from "@/components/mySchedules/SectionWeek";
import SectionCalendar from "@/components/mySchedules/SectionCalendar";
import { SECTION_ONE } from "@/constants";

export default function MySchedules() {
  const [actualView, setActualView] = useState(SECTION_ONE);

  return (
    <section className="flex flex-col items-center md:items-start py-28 px-5 md:pl-80">
      <SwitchButtons
        titleOne={"Week"}
        titleTwo={"Calendar"}
        setActualView={setActualView}
        actualView={actualView}
      />
      {actualView === SECTION_ONE ? <SectionWeek /> : <SectionCalendar />}
    </section>
  );
}
