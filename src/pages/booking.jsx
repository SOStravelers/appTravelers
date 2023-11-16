import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import Cookies from "js-cookie";
import { SECTION_ONE } from "@/constants";

const weekDays = [];
const today = dayjs();
const user = Cookies.get("auth.user_id");

weekDays.push({ day: today.format("ddd"), number: today.format("D") });
for (let i = 1; i <= 6; i++) {
  const day = today.add(i, "day");
  weekDays.push({ day: day.format("ddd"), number: day.format("D") });
}

export default function Booking() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "SOS Travelers - Booking";
    if (!user) {
      setOpen(true);
    }
  }, []);

  return (
    <div className="w-full min-h-screen py-24 px-3 md:pl-80 bg-white text-black">
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
