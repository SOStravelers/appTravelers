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

const today = dayjs();

export default function WorkerBooking() {
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [selectedDay, setSelectedDay] = useState(today.format("DD"));
  const [bookings, setBookings] = useState([]);

  const setWeek = async () => {
    try {
      const day = today.format("YYYY-MM-DD");
      const newWeekDays = await BookingService.getWeekWorker(day);
      setWeekDays(newWeekDays.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setWeek();
  }, [actualView]);

  useEffect(() => {
    setWeek();
    document.title = "Worker Booking | SOS Travelers";
  }, []);

  const comeBooking = async () => {
    try {
      const day = weekDays.find((day) => day.number === selectedDay);
      BookingService.getBookingsByDayWorker(day.date).then((res) => {
        if (res) {
          setBookings(res.data.docs);
        }
      });
    } catch (err) {
      console.log(err);
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
        <MonthSection />
      ) : null}
    </div>
  );
}
