import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "../cards/WorkerCardBooking";

import moment from "moment";

function CalendarBooking() {
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [month, setMonth] = useState();
  const [bookedDays, setBookedDays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState([]);
  const bookedStyle = { border: "2px solid black" };

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
    BookingService.getBookingsByMonth(day).then((res) => {
      if (res) {
        setBookings(res.data.docs);
        const bookings = res.data.docs.map((booking) => {
          return new Date(booking.date.isoDate);
        });
        setBookedDays(bookings);
      }
    });
  };

  const handleDayClick = (day, modifiers) => {
    setShowBookings([]);
    console.log(day, modifiers.booked);
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
      if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(2, "months").toDate());
    }
  };

  let footer = <p className="my-5">Please pick a day.</p>;
  if (showBookings.length > 0) {
    footer = (
      <div className="w-full mt-14">
        {showBookings.map((booking) => (
          <WorkerCardBooking
            key={booking._id}
            booking={booking}
            avatar={booking.avatar}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            name={`${booking.workerUser.personalData.name.first} ${booking.workerUser.personalData.name.last}`}
            location={booking.businessUser.businessData.name}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <DayPicker
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
      <div className="w-full mt-14">
        <Link href={`/service-history`}>
          <OutlinedButton text={"See all my records"} />
        </Link>
      </div>
    </div>
  );
}

export default CalendarBooking;
