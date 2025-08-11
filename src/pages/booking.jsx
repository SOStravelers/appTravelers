import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SwitchTabs from "@/components/utils/buttons/SwitchTabs";
import MonthSection from "@/components/booking/MonthSection";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import ListSection from "@/components/bookingWorker/ListSection";
import LanguageData from "@/language/booking.json";
import Cookies from "js-cookie";
import { useStore } from "@/store";

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
  const { loginModal, setLoginModal, setService, language, loggedIn } = store;
  const [actualView, setActualView] = useState(TAB_OPTIONS[0].value);
  const [open, setOpen] = useState(false);
  const user = Cookies.get("auth.user_id");

  useEffect(() => {
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

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
