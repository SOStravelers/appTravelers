import { useState, useEffect } from "react";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import BookingService from "@/services/BookingService";
import dayjs from "dayjs";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
function ServiceHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isWorker } = useStore();

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getAllBookingsByClient().then((res) => {
      if (res) {
        setBookings(res.data.docs);
        setLoading(false);
      }
    });
  };
  return (
    <div className="flex flex-col py-16 md:py-28 px-5 md:pl-80">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">{isWorker ? "Searching.." : "Pesquisando..."}</p>
        </div>
      ) : (
        <>
          <h1 className="text-xl text-center my-6 max-w-lg">
            Requested Services
          </h1>
          {bookings
            .filter((booking) => booking.status === "requested")
            .map((booking) => (
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
            ))}
          {!loading &&
            bookings.filter((booking) => booking.status === "requested")
              .length === 0 && (
              <p className="text-center text-greyText max-w-lg my-3">
                {"You do not have a booking requested"}
              </p>
            )}

          <h1 className="text-xl text-center my-8 max-w-lg">
            Upcoming Services
          </h1>
          {bookings
            .filter((booking) => booking.status === "confirmed")
            .map((booking) => (
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
            ))}
          {!loading &&
            bookings.filter((booking) => booking.status === "confirmed")
              .length === 0 && (
              <p className="text-center text-greyText max-w-lg my-3">
                {"You don't have any upcoming bookings"}
              </p>
            )}

          <h1 className="text-xl text-center my-8 max-w-lg">Closed services</h1>
          {bookings
            .filter(
              (booking) =>
                booking.status === "completed" || booking.status === "canceled"
            )
            .map((booking) => (
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
            ))}
          {!loading &&
            bookings.filter(
              (booking) =>
                booking.status === "completed" || booking.status === "canceled"
            ).length === 0 && (
              <p className="text-center text-greyText max-w-lg my-3">
                {"You don't have any previous bookings"}
              </p>
            )}
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
