import { useState, useEffect } from "react";
import dayjs from "dayjs";
import ThreeSwitchButtons from "@/components/utils/buttons/ThreeSwitchButtons";
import DaySection from "@/components/bookingWorker/DaySection";
import ListSection from "@/components/bookingWorker/ListSection";
import MonthSection from "@/components/bookingWorker/MonthSection";
import BookingService from "@/services/BookingService";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import { Rings } from "react-loader-spinner";
import {
  SECTION_ONE,
  SECTION_TWO,
  SECTION_THREE,
  SECTION_FOUR,
} from "@/constants";

/* const weekDays = [];
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
} */

const today = dayjs();

export default function WorkerBooking() {
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoadings] = useState(true);

  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(today.format("DD"));
  const [bookings, setBookings] = useState([]);

  const setWeek = async () => {
    try {
      const day = today.format("YYYY-MM-DD");
      const newWeekDays = await BookingService.getWeekWorker(day);
      setWeekDays(newWeekDays.data);
    } catch (err) {}
  };
  const comeBooking = async () => {
    setLoadings(true);
    try {
      const newDay = weekDays.find((day) => day.number === selectedDay);
      BookingService.getBookingsByDayWorker(newDay.date).then((res) => {
        if (res) {
          setBookings(res.data.docs);
          setLoadings(false);
        }
      });
    } catch (err) {
      console.log("error al obtenear bookings por dia");
      setLoadings(false);
    }
  };

  useEffect(() => {
    comeBooking();
  }, [weekDays, selectedDay]);

  useEffect(() => {
    setWeek();
    // setSelectedDay(today.format("DD"));
  }, [actualView]);

  useEffect(() => {
    setWeek();
    document.title = "Worker Booking | SOS Travelers";
  }, []);

  return (
    <div className="w-full min-h-screen py-20 md:py-24 px-3 md:pl-80 bg-white text-black">
      <ThreeSwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne="Lista"
        titleTwo="Dia"
        titleThree="Mês"
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
        <MonthSection day={today} />
      ) : null}
    </div>
  );
}
