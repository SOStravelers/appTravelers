import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { enUS, es, fr, de, ptBR } from "date-fns/locale";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "../cards/WorkerCardBooking";
import { useStore } from "@/store";
import moment from "moment";
import LanguageData from "@/language/booking.json";
import { getUserTimeData } from "@/lib/time/index.js";
import EventCard from "@/components/utils/cards/EventCard";
function CalendarBooking() {
  const store = useStore();
  const { language } = store;
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [month, setMonth] = useState();
  const [bookedDays, setBookedDays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState([]);
  // const bookedStyle = { border: "2px solid black" };

  const bookedStyle = {
    border: "1px solid black",
    borderColor: "#00A0D5 ",
    borderRadius: "50%",
    padding: "0px",
    boxSizing: "border-box",
  };

  const locales = {
    en: enUS,
    es: es,
    fr: fr,
    de: de,
    pt: ptBR,
  };

  useEffect(() => {
    initialize();
    setMonth(new Date());
  }, []);

  useEffect(() => {
    if (selected) {
      const dateString = moment({
        year: selected.getFullYear(),
        month: selected.getMonth(),
        day: selected.getDate(),
      }).format("YYYY-MM-DD");
      initialize(dateString);
    }
  }, [selected]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const baseData = getUserTimeData(language);
    const now = moment();
    const threeMonthsLater = moment().add(2, "months").endOf("month");

    const data = {
      ...baseData,
      range: "custom", // puede ser cualquier valor que evite el `switch default: month`
      start: now.startOf("day").toISOString(),
      end: threeMonthsLater.toISOString(),
    };

    BookingService.getBookingsByRange(data).then((res) => {
      if (res) {
        setBookings(res.data);
        const bookings = res.data.map(
          (booking) => new Date(booking.startTime.isoTime)
        );
        setBookedDays(bookings);
      }
    });
  };

  const handleDayClick = (day, modifiers) => {
    console.log("wena", day, modifiers);
    setShowBookings([]);

    if (modifiers.booked) {
      const clickedDate = moment(day).format("YYYY-MM-DD");

      const filteredBookings = bookings
        .filter((booking) => {
          const bookingDate = moment(booking.startTime.isoTime).format(
            "YYYY-MM-DD"
          );
          return bookingDate === clickedDate;
        })
        .sort((a, b) => {
          return new Date(a.startTime.isoTime) - new Date(b.startTime.isoTime);
        });

      setShowBookings(filteredBookings);
    }
  };

  const initialize = (dateString = "") => {
    const now = moment();
    if (dateString === now.format("YYYY-MM-DD") || selected === "") {
      // if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(2, "months").toDate());
    }
  };

  let footer = (
    <p className="my-2  text-textColorGray  text-center">
      {LanguageData.section3.pickDay[language]}
    </p>
  );
  // if (showBookings.length > 0) {
  //   footer = <div className="w-full "></div>;
  // }
  return (
    <div className="w-full flex flex-col ">
      <div className="flex justify-center items-center">
        <DayPicker
          className="mini-calendar  flex justify-center"
          mode="single"
          selected={selected}
          onSelect={setSelected}
          fromDate={fromDate}
          toDate={toDate}
          footer={footer}
          modifiers={{ booked: bookedDays }}
          modifiersStyles={{ booked: bookedStyle }}
          onDayClick={handleDayClick}
          onMonthChange={setMonth}
          locale={locales[language]}
          disabled={(date) => {
            const formatted = moment(date).format("YYYY-MM-DD");
            return !bookedDays.some(
              (d) => moment(d).format("YYYY-MM-DD") === formatted
            );
          }}
        />
      </div>

      <div className="justify-center mt-3 px-10 md:px-20 ">
        <Link href={`/service-history`}>
          <OutlinedButton
            text={LanguageData.section3.buttonRecords[language]}
            px={0}
            py={2}
            dark="darkLight"
            textSize="text-sm"
            textColor="text-white"
            buttonCenter={true}
          />
        </Link>
      </div>

      <div className="lg:px-10  mt-4 ">
        {showBookings.map((booking) => (
          <EventCard
            {...booking}
            fullWidth={false}
            isClosed={false}
            onClick={() => {}}
            details={true}
          />
          // <WorkerCardBooking
          //   key={booking._id}
          //   booking={booking}
          //   subService={booking.subservice.name[language]}
          //   // avatar={booking?.workerUser?.img?.imgUrl}
          //   avatar={
          //     booking.businessUser
          //       ? booking?.businessUser?.img?.imgUrl
          //       : booking?.subservice?.imgUrl
          //   }
          //   // status={booking.status}
          //   status={booking.status}
          //   date={booking.date.stringData}
          //   hour={booking.startTime.stringData}
          //   name={`${booking.subservice.name[language]}`}
          //   location={booking?.businessUser?.businessData?.name}
          // />
        ))}
      </div>
    </div>
  );
}

export default CalendarBooking;
