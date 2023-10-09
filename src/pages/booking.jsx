import { useState } from "react";
import dayjs from "dayjs";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import { SECTION_ONE } from "@/constants";

const weekDays = [];
const today = dayjs();
weekDays.push({ day: today.format("ddd"), number: today.format("D") });
for (let i = 1; i <= 6; i++) {
  const day = today.add(i, "day");
  weekDays.push({ day: day.format("ddd"), number: day.format("D") });
}

export default function Booking() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);

  return (
    <div className="w-screen h-screen p-5 bg-white text-black">
      <SwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne={"Day"}
        titleTwo={"Month"}
      />
      {actualView === SECTION_ONE ? (
        <DaySection
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      ) : (
        <MonthSection />
      )}
    </div>
  );
}
