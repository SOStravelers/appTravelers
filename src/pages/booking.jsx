import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchTabs from "@/components/utils/buttons/SwitchTabs";
import DaySection from "@/components/booking/DaySection";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import ListSection from "@/components/bookingWorker/ListSection";
import LanguageData from "@/language/booking.json";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import { getUserTimeData } from "@/lib/time/index.js";

const today = dayjs();

const TAB_OPTIONS = [
  { value: "next", labelKey: "next", component: <ListSection /> },
  // {
  //   value: "day",
  //   labelKey: "day",
  //   component: (
  //     <DaySection
  //       weekDays={weekDays}
  //       selectedDay={selectedDay}
  //       setSelectedDay={setSelectedDay}
  //       dayBookings={bookings}
  //       loading={loading}
  //     />
  //   ),
  // },
  { value: "month", labelKey: "month", component: <MonthSection /> },
];

export default function Booking() {
  const store = useStore();
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginModal, setLoginModal, setService, language, loggedIn } = store;
  const [actualView, setActualView] = useState(TAB_OPTIONS[0].value);
  const [selectedDay, setSelectedDay] = useState(today.format("DD"));
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const user = Cookies.get("auth.user_id");

  const setWeek = async () => {
    try {
      const data = getUserTimeData(language);
      data.range = "week";
      const res = await BookingService.getBookingsByMonth(data);
      if (res) setWeekDays(res.data);
    } catch (err) {}
  };

  const comeBooking = async () => {
    try {
      const day = weekDays.find((day) => day.number === selectedDay);
      if (user && day) {
        const res = await BookingService.getBookingsByDay(day.date);
        if (res) setBookings(res.data.docs);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => setLoading(true), [actualView]);
  useEffect(() => setLoading(true), [selectedDay]);
  useEffect(() => setLoading(false), [bookings]);
  useEffect(() => comeBooking(), [weekDays, selectedDay]);

  useEffect(() => {
    document.title = "Booking | SOS Travelers";
    if (loginModal) {
      setOpen(false);
      setLoginModal(false);
    }
    if (!user) setOpen(true);
  }, [loginModal]);

  const currentTab = TAB_OPTIONS.find((tab) => tab.value === actualView);

  return (
    <div className="mx-auto px-4 md:pl-[240px] bg-backgroundP">
      <div
        className={`min-h-screen bg-backgroundP p-4 lg:max-w-3xl flex flex-col items-center
    transition-all duration-800 ease-out
    transition-opacity duration-800 ease-out  border-b-2 border-gray-400 rounded-xl shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)]
   
  `}
      >
        <SwitchTabs
          options={TAB_OPTIONS.map(({ value, labelKey }) => ({
            value,
            label: LanguageData.tabs[labelKey][language],
          }))}
          actualView={actualView}
          setActualView={setActualView}
        />
        {currentTab?.component || null}

        {!loggedIn && (
          <LoginFormModal
            open={open}
            setOpen={setOpen}
            title="Login to continue"
          />
        )}
      </div>
    </div>
  );
}
