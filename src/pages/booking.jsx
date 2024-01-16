import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import ThreeSwitchButtons from "@/components/utils/buttons/ThreeSwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import ListSection from "@/components/bookingWorker/ListSection";
import {
  SECTION_ONE,
  SECTION_TWO,
  SECTION_THREE,
  SECTION_FOUR,
} from "@/constants";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
const weekDays = [];
const today = dayjs();

weekDays.push({
  day: today.format("ddd"),
  number: today.format("D"),
  date: today.format("YYYY-MM-DD"),
});
for (let i = 1; i <= 6; i++) {
  const day = today.add(i, "day");
  weekDays.push({
    day: day.format("ddd"),
    number: day.format("D"),
    date: day.format("YYYY-MM-DD"),
  });
}

export default function Booking() {
  const store = useStore();
  const { loginModal, setLoginModal } = store;
  var user = Cookies.get("auth.user_id");
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].number);
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);
  useEffect(() => {
    const day = weekDays.find((day) => day.number === selectedDay);
    if (user) {
      BookingService.totalNumberWeek(day.date).then((res) => {
        if (res) {
        }
      });
    }
  }, []);

  useEffect(() => {
    const day = weekDays.find((day) => day.number === selectedDay);
    if (user) {
      BookingService.getBookingsByDay(day.date).then((res) => {
        if (res) {
          setBookings(res.data.docs);
        }
      });
    }
  }, [selectedDay]);

  useEffect(() => {
    document.title = "Booking | SOS Travelers";
    const user = Cookies.get("auth.user_id");
    if (loginModal) {
      setOpen(false);
      setLoginModal(false);
    }
    if (!user) {
      setOpen(true);
    }
  }, [loginModal]);

  return (
    <div className="w-full min-h-screen py-20 md:py-24 px-3 md:pl-80 bg-white text-black">
      {/* <SwitchButtons
        style={{ position: "sticky", top: "10000px" }}
        actualView={actualView}
        setActualView={setActualView}
        titleOne={"Day"}
        titleTwo={"Month"}
      /> */}
      <ThreeSwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne="Next"
        titleTwo="Day"
        titleThree="Month"
      />
      {actualView === SECTION_ONE ? (
        <ListSection />
      ) : actualView === SECTION_TWO ? (
        <DaySection
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          dayBookings={bookings}
        />
      ) : actualView === SECTION_THREE ? (
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
