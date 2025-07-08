import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import ThreeSwitchButtons from "@/components/utils/buttons/ThreeSwitchButtons";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import ListSection from "@/components/bookingWorker/ListSection";
import LanguageData from "@/language/booking.json";
import {
  SECTION_ONE,
  SECTION_TWO,
  SECTION_THREE,
  SECTION_FOUR,
} from "@/constants";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
const today = dayjs();

export default function Booking() {
  const store = useStore();
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginModal, setLoginModal, setService, language, loggedIn } = store;
  var user = Cookies.get("auth.user_id");
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(today.format("DD"));
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  const setWeek = async () => {
    try {
      const day = today.format("YYYY-MM-DD");
      console.log("el dia", day);
      const newWeekDays = await BookingService.getWeekUser(day, language);
      console.log("hola", newWeekDays.data);
      setWeekDays(newWeekDays.data);
    } catch (err) {}
  };

  useEffect(() => {
    setWeek();
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    setLoading(true);
    setWeek();
  }, [actualView]);

  const comeBooking = async () => {
    try {
      const day = weekDays.find((day) => day.number === selectedDay);
      console.log("buen dia", day);
      if (user) {
        BookingService.getBookingsByDay(day.date).then((res) => {
          if (res) {
            console.log("respuesta", res.data.docs);
            setBookings(res.data.docs);
          }
        });
      }
    } catch (err) {
      console.log("error al obtenear bookings por dia");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
  }, [selectedDay]);
  useEffect(() => {
    setLoading(false);
  }, [bookings]);
  useEffect(() => {
    comeBooking();
  }, [weekDays, selectedDay]);

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
        titleOne={LanguageData.tabs.next[language]}
        titleTwo={LanguageData.tabs.day[language]}
        titleThree={LanguageData.tabs.month[language]}
      />
      {actualView === SECTION_ONE ? (
        <ListSection />
      ) : actualView === SECTION_TWO ? (
        <DaySection
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          dayBookings={bookings}
          loading={loading}
        />
      ) : actualView === SECTION_THREE ? (
        <MonthSection />
      ) : null}

      {!loggedIn && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
