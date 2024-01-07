import { useState, useEffect } from "react";
import WorkerCardBookingRequest from "@/components/utils/cards/WorkerCardBookingRequest";
import BookingService from "@/services/BookingService";
import dayjs from "dayjs";

function Requests() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getAllBookingsByWorker().then((res) => {
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
        <h1 className="text-xl text-center mb-8 max-w-lg">
          Requested services
        </h1>
      )}
      {bookings.map((booking) => (
        <WorkerCardBookingRequest
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

export default Requests;
