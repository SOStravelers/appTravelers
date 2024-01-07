import { useState, useEffect } from "react";
import dayjs from "dayjs";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";

function ListSection() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getBookingsByList(today)
      .then((response) => {
        setBookings(response.data.docs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-10">
      <h1 className="text-center max-w-lg text-xl my-5">Today</h1>
      <div className="flex flex-col">
        {bookings
          .filter(
            (booking) =>
              booking.date.stringData === dayjs().format("YYYY-MM-DD")
          )
          .map((booking) => (
            <WorkerCardBooking
              key={booking._id}
              booking={booking}
              avatar={booking.avatar}
              date={booking.date.stringData}
              hour={booking.startTime.stringData}
              name={`${booking.clientUser.personalData.name.first} ${booking.clientUser.personalData.name.last}`}
              location={booking.businessUser.businessData.name}
            />
          ))}
        {bookings.filter(
          (booking) => booking.date.stringData === dayjs().format("YYYY-MM-DD")
        ).length === 0 && (
          <p className="text-center text-greyText max-w-lg my-10">
            No bookings for today
          </p>
        )}
        <h1 className="text-center max-w-lg text-xl my-5">Next Days</h1>
        {bookings
          .filter(
            (booking) =>
              booking.date.stringData !== dayjs().format("YYYY-MM-DD")
          )
          .map((booking) => (
            <WorkerCardBooking
              key={booking._id}
              booking={booking}
              avatar={booking.avatar}
              date={booking.date.stringData}
              hour={booking.startTime.stringData}
              name={`${booking.clientUser.personalData.name.first} ${booking.clientUser.personalData.name.last}`}
              location={booking.businessUser.businessData.name}
            />
          ))}
        {bookings.filter(
          (booking) => booking.date.stringData !== dayjs().format("YYYY-MM-DD")
        ).length === 0 && (
          <p className="text-center text-greyText max-w-lg my-10">
            No bookings for the next days
          </p>
        )}
      </div>
    </div>
  );
}

export default ListSection;
