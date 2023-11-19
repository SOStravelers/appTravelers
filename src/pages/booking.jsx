import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import { SECTION_ONE } from "@/constants";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import { useRouter } from "next/router";
const weekDays = [];
const today = dayjs();

weekDays.push({ day: today.format("ddd"), number: today.format("D") });
for (let i = 1; i <= 6; i++) {
  const day = today.add(i, "day");
  weekDays.push({ day: day.format("ddd"), number: day.format("D") });
}

export default function Booking() {
  const store = useStore();
  const { loginModal, setLoginModal } = store;
  const router = useRouter();
  var user = Cookies.get("auth.user_id");
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.title = "Booking - SOS Travelers";
    const user = Cookies.get("auth.user_id");
    console.log("user booking", user);
    console.log("login modal booking", loginModal);
    if (loginModal) {
      setOpen(false);
      setLoginModal(false);
      router.push("/");
    }
    if (!user) {
      console.log("entro al open");
      setOpen(true);
    }
  }, [loginModal]);

  return (
    <div className="w-full min-h-screen py-20 lg:py-24 xl:py-24 px-3 md:pl-80 bg-white text-black">
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
