import { useState, useEffect } from "react";
import dayjs from "dayjs";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
import LanguageData from "@/language/booking.json";
function ListSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isWorker, user, language } = useStore();
  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");

    if (isWorker) {
      BookingService.getBookingsByListWorker(today)
        .then((response) => {
          setBookings(response.data.docs);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      BookingService.getBookingsByListClient(today)
        .then((response) => {
          setBookings(response.data.docs);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-center max-w-lg text-xl my-5">
        {LanguageData.section1.today[language]}
      </h1>
      <div className="flex flex-col">
        {loading ? (
          <div className="max-w-lg flex flex-col items-center justify-center">
            <Rings
              width={100}
              height={100}
              color="#00A0D5"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        ) : (
          bookings
            .filter(
              (booking) =>
                booking.date.stringData === dayjs().format("YYYY-MM-DD")
            )
            .map((booking) => (
              <WorkerCardBooking
                key={booking._id}
                booking={booking}
                subService={booking.subservice.name[language]}
                status={booking.status}
                service={booking.service.name[language]}
                avatar={
                  booking.businessUser
                    ? booking?.businessUser?.img?.imgUrl
                    : booking?.subservice?.imgUrl
                }
                date={booking.date.stringData}
                hour={booking.startTime.stringData}
                name={`${
                  booking.businessUser
                    ? booking?.businessUser?.businessData?.name
                    : booking?.workerUser?.personalData?.name?.first +
                      " " +
                      booking?.workerUser?.personalData?.name?.last
                }`}
                // name={`${booking?.businessUser?.businessData?.name}`}
              />
            ))
        )}
        {!loading &&
          bookings.filter(
            (booking) =>
              booking.date.stringData === dayjs().format("YYYY-MM-DD")
          ).length === 0 && (
            <p className="text-center text-greyText max-w-lg my-3">
              {LanguageData.section1.noBookings.today[language]}
            </p>
          )}
        <h1 className="text-center max-w-lg text-xl my-5">
          {LanguageData.section1.nextDays[language]}
        </h1>
        {loading ? (
          <div className="max-w-lg flex flex-col items-center justify-center">
            <Rings
              width={100}
              height={100}
              color="#00A0D5"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        ) : (
          bookings
            .filter(
              (booking) =>
                booking.date.stringData !== dayjs().format("YYYY-MM-DD")
            )
            .map((booking) => (
              <WorkerCardBooking
                key={booking._id}
                booking={booking}
                subService={booking.subservice.name[language]}
                status={booking.status}
                service={booking.service.name[language]}
                avatar={
                  booking.businessUser
                    ? booking?.businessUser?.img?.imgUrl
                    : booking?.subservice?.imgUrl
                }
                date={booking.date.stringData}
                hour={booking.startTime.stringData}
                // name={`${booking?.businessUser?.businessData?.name}`}
                name={`${
                  booking.businessUser
                    ? booking?.businessUser?.businessData?.name
                    : booking?.workerUser?.personalData?.name?.first +
                      " " +
                      booking?.workerUser?.personalData?.name?.last
                }`}
              />
            ))
        )}
        {!loading &&
          bookings.filter(
            (booking) =>
              booking.date.stringData !== dayjs().format("YYYY-MM-DD")
          ).length === 0 && (
            <p className="text-center text-greyText max-w-lg my-10">
              {LanguageData.section1.noBookings.nextDays[language]}
            </p>
          )}
      </div>
    </div>
  );
}

export default ListSection;
