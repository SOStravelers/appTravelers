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
        }
      })
      .catch((error) => {
        setLoading(false);
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
          <p className="mt-2">Pesquisando...</p>
        </div>
      ) : (
        <>
          <h1 className="text-xl text-center my-6 max-w-lg">
            Serviços solicitados
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
                {"Não há reservas para solicitadas"}
              </p>
            )}

          <h1 className="text-xl text-center my-8 max-w-lg">
            Próximos serviços
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
                {"Não há reservas confirmadas"}
              </p>
            )}

          <h1 className="text-xl text-center my-8 max-w-lg">
            Serviços concluídos
          </h1>
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
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
