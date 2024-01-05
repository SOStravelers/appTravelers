import { useState, useEffect } from "react";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import BookingService from "@/services/BookingService";
import dayjs from "dayjs";

function ServiceHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getLastestBookings(today).then((res) => {
      if (res) {
        setBookings(res.data.docs);
        console.log(res.data.docs);
      }
    });
  };
  return (
    <div className="flex flex-col py-20 md:py-28 px-5 md:pl-80">
      {bookings.filter((booking) => booking.status === "requested").length >
        0 && (
        <h1 className="text-xl text-center my-8 max-w-lg">
          Requested services
        </h1>
      )}
      {bookings
        .filter((booking) => booking.status === "requested")
        .map((booking) => (
          <WorkerCardBooking
            key={booking._id}
            link={"/"}
            name={`${booking.workerUser.personalData.name.first} ${booking.workerUser.personalData.name.last}`}
            location={booking.businessUser.businessData.name}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            showArrow={false}
            booking={booking}
          />
        ))}

      {bookings.filter((booking) => booking.status === "confirmed").length >
        0 && (
        <h1 className="text-xl text-center my-8 max-w-lg">Incoming services</h1>
      )}
      {bookings
        .filter((booking) => booking.status === "confirmed")
        .map((booking) => (
          <WorkerCardBooking
            key={booking._id}
            link={"/"}
            name={`${booking.workerUser.personalData.name.first} ${booking.workerUser.personalData.name.last}`}
            location={booking.businessUser.businessData.name}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            showArrow={false}
            booking={booking}
          />
        ))}

      {bookings.filter((booking) => booking.status === "completed").length >
        0 && (
        <h1 className="text-xl text-center my-8 max-w-lg">Last services</h1>
      )}
      {bookings
        .filter((booking) => booking.status === "completed")
        .map((booking) => (
          <WorkerCardBooking
            key={booking._id}
            link={"/"}
            name={`${booking.workerUser.personalData.name.first} ${booking.workerUser.personalData.name.last}`}
            location={booking.businessUser.businessData.name}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            showArrow={false}
            booking={booking}
          />
        ))}
    </div>
  );
}

export default ServiceHistory;
