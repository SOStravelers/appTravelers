import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { ReservationIcon } from "@/constants/icons";

function DaySection({ weekDays, selectedDay, setSelectedDay }) {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const user = Cookies.get("auth.user_id");
    if (user) {
      setBookings([
        {
          name: "John Doe",
          location: "124 street Miro Hotel, Ubud",
          link: "/",
        },
        {
          name: "John Doe",
          location: "124 street Miro Hotel, Ubud",
          link: "/",
        },
        {
          name: "John Doe",
          location: "124 street Miro Hotel, Ubud",
          link: "/",
        },
      ]);
    }
  }, []);
  return (
    <>
      <div className="flex my-5 md:mx-16">
        {weekDays.map((day, index) => (
          <DayButton
            key={index}
            day={day.day}
            number={day.number}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        ))}
      </div>

      <h1 className="text-center max-w-lg text-xl my-3">My next Commitments</h1>

      <div className="flex flex-col">
        <p className="text-center text-greyText max-w-lg my-10">
          No bookings yet
        </p>
        <div className="max-w-lg text-xl my-3 flex justify-center">
          <ReservationIcon />
        </div>

        {bookings.map((booking, index) => (
          <WorkerCardBooking
            key={index}
            name={booking.name}
            location={booking.location}
            link={booking.link}
          />
        ))}
      </div>
    </>
  );
}

export default DaySection;
