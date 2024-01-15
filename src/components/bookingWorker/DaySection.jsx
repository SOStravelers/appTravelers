import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { ReservationIcon } from "@/constants/icons";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
function DaySection({
  weekDays,
  selectedDay,
  setSelectedDay,
  dayBookings,
  loading,
}) {
  const [bookings, setBookings] = useState(null);
  const { isWorker, user } = useStore();
  console.log("wena");
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

      <h1 className="text-center max-w-lg text-xl my-3">
        {isWorker ? "Próximos compromissos" : "My next Commitments"}
      </h1>

      <div className="flex flex-col">
        {!bookings ? (
          <div className="max-w-lg flex flex-col items-center justify-center">
            <Rings
              width={100}
              height={100}
              color="#00A0D5"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        ) : bookings?.length > 0 ? (
          bookings.map((booking) => (
            <WorkerCardBooking
              key={booking._id}
              booking={booking}
              subService={booking.subservice.name}
              status={booking.status}
              service={booking.service.name}
              avatar={booking?.businessUser?.img?.imgUrl}
              date={booking.date.stringData}
              hour={booking.startTime.stringData}
              name={`${booking?.businessUser?.businessData?.name}`}
            />
          ))
        ) : (
          <>
            <p className="text-center text-greyText max-w-lg my-10">
              {isWorker ? "Não há reservas ainda" : "No bookings yet"}
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
