import { useEffect, useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { enUS, es, fr, de, ptBR } from "date-fns/locale";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import BookingService from "@/services/BookingService";
import { useStore } from "@/store";
import moment from "moment";
import LanguageData from "@/language/booking.json";
import { getUserTimeData } from "@/lib/time/index.js";
import EventCard from "@/components/utils/cards/EventCard";
function CalendarBooking() {
  const { language } = useStore();

  const [selected, setSelected] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [bookedDays, setBookedDays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState([]);

  const bookedStyle = {
    border: "1px solid black",
    borderColor: "#00A0D5",
    borderRadius: "50%",
    padding: "0px",
    boxSizing: "border-box",
  };

  const locales = { en: enUS, es, fr, de, pt: ptBR };

  useEffect(() => {
    // carga inicial (mes actual)
    fetchMonthBookings(visibleMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // cuando cambia el mes visible, volvemos a pedir al back ese mes
    if (!visibleMonth) return;
    fetchMonthBookings(visibleMonth);
    setSelected(null);
    setShowBookings([]);
  }, [visibleMonth, language]);

  useEffect(() => {
    if (!selected) return setShowBookings([]);
    const dayStr = moment(selected).format("YYYY-MM-DD");
    const filtered = bookings
      .filter((b) => moment(b.startTime.isoTime).isSame(dayStr, "day"))
      .sort(
        (a, b) => new Date(a.startTime.isoTime) - new Date(b.startTime.isoTime)
      );
    setShowBookings(filtered);
  }, [selected, bookings]);

  const fetchMonthBookings = async (monthDate) => {
    const baseData = getUserTimeData(language); // { isoTime, timeZone, language, ... }
    const payload = {
      ...baseData,
      range: "month",
      month: { year: monthDate.getFullYear(), month: monthDate.getMonth() + 1 }, // 1-12
    };
    try {
      const res = await BookingService.getBookingsByRange(payload);
      const data = Array.isArray(res?.data) ? res.data : [];
      setBookings(data);
      setBookedDays(data.map((b) => new Date(b.startTime.isoTime)));
    } catch (e) {
      console.error("Error al cargar bookings del mes:", e);
      setBookings([]);
      setBookedDays([]);
    }
  };

  const footer = (
    <p className="my-2 text-textColorGray text-center">
      {LanguageData.section3.pickDay[language]}
    </p>
  );

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center items-center">
        <DayPicker
          className="mini-calendar flex justify-center"
          mode="single"
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          selected={selected}
          onSelect={setSelected}
          modifiers={{ booked: bookedDays }}
          modifiersStyles={{ booked: bookedStyle }}
          locale={locales[language]}
          onDayClick={(day, modifiers) => {
            if (!modifiers.disabled) setSelected(day);
          }}
          disabled={(date) => {
            const formatted = moment(date).format("YYYY-MM-DD");
            return !bookedDays.some(
              (d) => moment(d).format("YYYY-MM-DD") === formatted
            );
          }}
          footer={footer}
        />
      </div>

      <div className="justify-center mt-3 px-10 md:px-20">
        <Link href={`/service-history`}>
          <OutlinedButton
            text={LanguageData.section3.buttonRecords[language]}
            px={0}
            py="py-2"
            dark="darkLight"
            textSize="text-sm"
            textColor="text-white"
            buttonCenter={true}
          />
        </Link>
      </div>

      <div className="lg:px-10 mt-4">
        {showBookings.map((booking) => (
          <EventCard
            key={booking._id}
            {...booking}
            fullWidth={false}
            isClosed={false}
            onClick={() => {}}
            details={true}
          />
        ))}
      </div>
    </div>
  );
}
export default CalendarBooking;
