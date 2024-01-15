import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { ReservationIcon } from "@/constants/icons";

function DaySection({ weekDays, selectedDay, setSelectedDay, dayBookings }) {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const user = Cookies.get("auth.user_id");
    if (user) {
      setBookings(dayBookings);
    }
  }, [dayBookings]);
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
            bookings={bookings?.length}
          />
        ))}
      </div>

      <h1 className="text-center max-w-lg text-xl my-3">My next Commitments</h1>

      <div className="flex flex-col">
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <WorkerCardBooking
              key={booking._id}
              booking={booking}
              avatar={booking?.workerUser?.img?.imgUrl}
              status={booking.status}
              date={booking.date.stringData}
              hour={booking.startTime.stringData}
              name={`${booking.subservice.name}`}
              location={booking.businessUser.businessData.name}
            />
          ))
        ) : (
          <>
            <p className="text-center text-greyText max-w-lg my-10">
              No bookings yet
            </p>
            <div className="max-w-lg text-xl ml-2 my-3 flex justify-center">
              <ReservationIcon />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DaySection;
