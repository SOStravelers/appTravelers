import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "../cards/WorkerCardBooking";
import { useStore } from "@/store";
import moment from "moment";

function CalendarBookingWorker() {
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
    if (month) {
      const dateString = moment({
        year: month.getFullYear(),
        month: month.getMonth(),
        day: month.getDate(),
      }).format("YYYY-MM-DD");
      getBookings(dateString);
    }
  }, [month]);

  const getBookings = (day) => {
    BookingService.getBookingsByMonthWorker(day).then((res) => {
      if (res) {
        setBookings(res.data.docs);
        console.log(res.data.docs);
        const bookings = res.data.docs.map((booking) => {
          return new Date(booking.date.isoDate);
        });
        setBookedDays(bookings);
      }
    });
  };

  const handleDayClick = (day, modifiers) => {
    setShowBookings([]);
    if (modifiers.booked) {
      const dateString = moment({
        year: day.getFullYear(),
        month: day.getMonth(),
        day: day.getDate(),
      }).format("YYYY-MM-DD");

      const filteredbookings = [];
      bookings.forEach((booking) => {
        if (booking.date.stringData === dateString) {
          filteredbookings.push(booking);
        }
      });
      setShowBookings(filteredbookings);
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

  let footer = <p className="my-2">Por favor, escolha um dia.</p>;
  if (showBookings.length > 0) {
    footer = <div className="w-full "></div>;
  }
  return (
    <div className="">
      <DayPicker
        className="flex justify-center"
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
      />
      <div className="w-full  mt-4 px-1">
        {showBookings.map((booking) => (
          <WorkerCardBooking
            key={booking._id}
            booking={booking}
            subService={booking.subservice.name[language]}
            status={booking.status}
            service={booking.service.name[language]}
            avatar={booking?.businessUser?.img?.imgUrl}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            name={`${booking?.businessUser?.businessData?.name}`}
          />
        ))}
      </div>
      <div className="w-full mt-6 px-5">
        <Link href={`/worker/service-history`}>
          <OutlinedButton text={"Ver todos os meus registros"} />
        </Link>
      </div>
    </div>
  );
}

export default CalendarBookingWorker;
