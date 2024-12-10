import { useState, useEffect } from "react";
import WorkerCardBookingRequest from "@/components/utils/cards/WorkerCardBookingRequest";
import BookingService from "@/services/BookingService";
import { ReservationIcon } from "@/constants/icons";
import { Rings } from "react-loader-spinner";
import dayjs from "dayjs";
import { useStore } from "@/store";
function Requests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { language } = useStore();
  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    setLoading(true);
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getAllBookingsAvailable().then((res) => {
      if (res) {
        setBookings(res.data.docs);
        setLoading(false);
      }
    });
  };
  return (
    <div className="mt-1 p-10 pb-20 flex  flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-1 text-center max-w-lg"> Trabalhos disponíveis</h1>
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
      ) : bookings?.length > 0 ? (
        bookings.map((booking) => (
          <WorkerCardBookingRequest
            key={booking._id}
            booking={booking}
            subService={booking.subservice.name[language]}
            status={booking.status == "available" ? "Disponível" : "Solicitado"}
            service={booking.service.name[language]}
            avatar={booking?.businessUser?.img?.imgUrl}
            date={booking.date.stringData}
            hour={booking.startTime.stringData}
            name={`${booking?.businessUser?.businessData?.name}`}
          />
        ))
      ) : (
        <>
          <p className="text-center text-greyText max-w-lg my-10">
            {"não há trabalhos disponíveis"}
          </p>
          <div className="max-w-lg text-xl ml-2 my-3 flex justify-center">
            <ReservationIcon />
          </div>
        </>
      )}
    </div>
  );
}

export default Requests;
