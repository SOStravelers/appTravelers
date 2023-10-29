import { useState } from "react";
import dayjs from "dayjs";
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

const weekDays = [];
const today = dayjs();
weekDays.push({ day: today.format("ddd"), number: today.format("D") });
for (let i = 1; i <= 6; i++) {
  const day = today.add(i, "day");
  weekDays.push({ day: day.format("ddd"), number: day.format("D") });
}

export default function WorkerBooking() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const user = Cookies.get("auth.user_id");
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);
  return (
    <div className="py-28 px-5 md:pl-80">
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

      {!user && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
