import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
import LanguageData from "@/language/booking.json";
import { getUserTimeData } from "@/lib/time/index.js";
function ListSection() {
  const [bookingsDay, setBookingsDay] = useState([]);
  const [bookingsWeek, setBookingsWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isWorker, user, language } = useStore();

  const getBookings = (range) => {
    console.log("el dia");
    const data = getUserTimeData(language);
    data.range = range;
    console.log("wena");
    BookingService.getBookingsByMonth(data)
      .then((response) => {
        if (range == "day") {
          setBookingsDay(response.data);
        } else if (range == "week") {
          setBookingsWeek(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBookings("day");
    getBookings("week");
  }, []);

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
          bookingsDay.map((booking) => (
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
        {!loading && bookingsDay.length === 0 && (
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
          bookingsWeek.map((booking) => (
            <WorkerCardBooking
              key={booking._id}
              booking={booking}
              subService={booking.subserviceData.name[language]}
              status={booking.status}
              service={booking.serviceData.name[language]}
              avatar={
                booking.businessUser
                  ? booking?.businessUser?.img?.imgUrl
                  : booking?.subservice?.imgUrl
              }
              date={booking.startTime.formatedDate}
              hour={booking.startTime.formatedTime}
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
        {!loading && bookingsWeek.length === 0 && (
          <p className="text-center text-greyText max-w-lg my-10">
            {LanguageData.section1.noBookings.nextDays[language]}
          </p>
        )}
      </div>
    </div>
  );
}

export default ListSection;
