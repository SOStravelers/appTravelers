import { useState, useEffect } from "react";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";
function ServiceHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    BookingService.getAllBookingsByWorker()
      .then((res) => {
        if (res) {
          setBookings(res.data.docs);
          setLoading(false);
          console.log(res.data.docs);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col py-20 md:py-28 px-5 md:pl-80">
      {bookings.filter((booking) => booking.status === "requested").length >
        0 && (
        <h1 className="text-xl text-center my-6 max-w-lg">
          Requested services
        </h1>
      )}
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : (
        <>
          {bookings
            .filter((booking) => booking.status === "requested")
            .map((booking) => (
              <WorkerCardBooking
                key={booking._id}
                link={"/"}
                avatar={booking.businessUser?.img?.imgUrl}
                name={`${booking.clientUser.personalData.name.first} ${booking.clientUser.personalData.name.last}`}
                location={booking.businessUser.businessData.name}
                date={booking.date.stringData}
                hour={booking.startTime.stringData}
                showArrow={false}
                booking={booking}
              />
            ))}

          {bookings.filter((booking) => booking.status === "confirmed").length >
            0 && (
            <h1 className="text-xl text-center my-8 max-w-lg">
              Incoming services
            </h1>
          )}
          {bookings
            .filter((booking) => booking.status === "confirmed")
            .map((booking) => (
              <WorkerCardBooking
                key={booking._id}
                link={"/"}
                avatar={booking.businessUser?.img?.imgUrl}
                name={`${booking.clientUser.personalData.name.first} ${booking.clientUser.personalData.name.last}`}
                location={booking.businessUser.businessData.name}
                date={booking.date.stringData}
                hour={booking.startTime.stringData}
                showArrow={false}
                booking={booking}
              />
            ))}

          {bookings.filter((booking) => booking.status === "accepted").length >
            0 && (
            <h1 className="text-xl text-center my-8 max-w-lg">Last services</h1>
          )}
          {bookings
            .filter((booking) => booking.status === "completed")
            .map((booking) => (
              <WorkerCardBooking
                key={booking._id}
                link={"/"}
                avatar={booking.businessUser?.img?.imgUrl}
                name={`${booking.clientUser.personalData.name.first} ${booking.clientUser.personalData.name.last}`}
                location={booking.businessUser.businessData.name}
                date={booking.date.stringData}
                hour={booking.startTime.stringData}
                showArrow={false}
                booking={booking}
              />
            ))}
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
