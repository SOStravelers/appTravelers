import { useState } from "react";
import MultiSwitchButtons from "@/components/utils/buttons/MultiSwitchButtons";
import DaySection from "@/components/bookingWorker/DaySection";
import ListSection from "@/components/bookingWorker/ListSection";
import MonthSection from "@/components/bookingWorker/MonthSection";
import {
  SECTION_ONE,
  SECTION_TWO,
  SECTION_THREE,
  SECTION_FOUR,
} from "@/constants";

const weekDays = [
  { day: "Mon", number: 25 },
  { day: "Tue", number: 26 },
  { day: "Wed", number: 27 },
  { day: "Thu", number: 28 },
  { day: "Fri", number: 29 },
  { day: "Sat", number: 30 },
  { day: "Sun", number: 31 },
];

export default function WorkerBooking() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);
  return (
    <div className="p-5">
      <MultiSwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne="List"
        titleTwo="Day"
        titleThree="Week"
        titleFour="Month"
      />

      {actualView === SECTION_ONE ? (
        <ListSection />
      ) : actualView === SECTION_TWO ? (
        <DaySection
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      ) : actualView === SECTION_THREE ? (
        <DaySection
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      ) : actualView === SECTION_FOUR ? (
        <MonthSection />
      ) : null}
    </div>
  );
}
