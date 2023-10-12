import { useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionWeek from "@/components/mySchedules/SectionWeek";
import SectionCalendar from "@/components/mySchedules/SectionCalendar";
import { SECTION_ONE, SECTION_TWO } from "@/constants";

export default function MySchedules() {
  const [actualView, setActualView] = useState(SECTION_ONE);

  return (
    <section className="p-5">
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
