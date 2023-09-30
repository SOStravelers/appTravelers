import { useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import { SECTION_ONE } from "@/constants";

const weekDays = [
  { day: "Mon", number: 25 },
  { day: "Tue", number: 26 },
  { day: "Wed", number: 27 },
  { day: "Thu", number: 28 },
  { day: "Fri", number: 29 },
  { day: "Sat", number: 30 },
  { day: "Sun", number: 31 },
];

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
