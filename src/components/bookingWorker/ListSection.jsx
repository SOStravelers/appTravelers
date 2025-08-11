import { useState, useEffect } from "react";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
import LanguageData from "@/language/booking.json";
import { getUserTimeData } from "@/lib/time/index.js";
import EventCard from "@/components/utils/cards/EventCard";
import { diasSemana } from "@/utils/format";
import { useRouter } from "next/router";
import { FaRegCalendarAlt } from "react-icons/fa";
function ListSection() {
  const router = useRouter();
  const [bookingsDay, setBookingsDay] = useState([]);
  const [bookingsWeek, setBookingsWeek] = useState([]);
  const [nextBooking, setNextBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useStore();

  const getBookings = (range) => {
    const data = getUserTimeData(language);
    data.range = range;
    BookingService.getBookingsByRange(data)
      .then((response) => {
        if (range === "day") setBookingsDay(response.data);
        else if (range === "week") setBookingsWeek(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBookings("day");
    getBookings("week");
    BookingService.getNextBooking()
      .then((res) => setNextBooking(res.data || null))
      .catch((err) =>
        console.error("Error al obtener el próximo booking:", err)
      );
  }, []);

  const filteredBookingsWeek = bookingsWeek.filter(
    (w) => !bookingsDay.some((d) => d._id === w._id)
  );

  const groupedByDay = {};
  filteredBookingsWeek.forEach((booking) => {
    const day = new Date(booking.startTime.isoTime).getDay();
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push(booking);
  });

  return (
    <div className="mt-5 mb-24 flex flex-col">
      <BookingSection
        loading={loading}
        title={LanguageData.section1.nextBooking[language]}
        bookings={nextBooking ? [nextBooking] : []}
        noDataText={LanguageData.section1.noBookings.next[language]}
      />

      <BookingSection
        loading={loading}
        title={LanguageData.section1.today[language]}
        bookings={bookingsDay}
        noDataText={LanguageData.section1.noBookings.today[language]}
      />

      <div className="flex flex-col">
        <h1 className="text-center text-textColor max-w-lg text-xl my-5">
          {LanguageData.section1.nextDays[language]}
        </h1>

        {loading ? (
          <Loader />
        ) : (
          Object.keys(groupedByDay).map((dayKey) => (
            <div key={dayKey} className="mb-6">
              <h2 className=" flex align-items justify-center text-textColor font-semibold mb-2 text-center">
                <FaRegCalendarAlt size={24} className="mr-2" />
                <div>{diasSemana[language]?.[dayKey] || ""}</div>
              </h2>
              {groupedByDay[dayKey].map((booking) => (
                <EventCard
                  key={booking._id}
                  {...booking}
                  fullWidth={false}
                  isClosed={false}
                  onClick={() => router.push(`/my-booking/${booking._id}`)}
                  details={true}
                />
              ))}
            </div>
          ))
        )}

        {!loading && filteredBookingsWeek.length === 0 && (
          <p className="text-center text-textColorGray max-w-lg my-10">
            {LanguageData.section1.noBookings.nextDays[language]}
          </p>
        )}
      </div>
    </div>
  );
}

function BookingSection({ title, bookings, loading, noDataText }) {
  const router = useRouter();
  return (
    <div className="flex flex-col my-5">
      <h1 className="text-center text-textColor font-semibold text-xl mb-3">
        {title}
      </h1>
      {loading ? (
        <Loader />
      ) : bookings.length > 0 ? (
        bookings.map((booking) => (
          <EventCard
            key={booking._id}
            {...booking}
            fullWidth={false}
            isClosed={false}
            onClick={() => router.push(`/my-booking/${booking._id}`)}
            details={true}
          />
        ))
      ) : (
        <p className="text-center text-textColorGray max-w-lg my-3">
          {noDataText}
        </p>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="max-w-lg flex flex-col items-center justify-center">
      <Rings width={100} height={100} color="#00A0D5" ariaLabel="loading" />
    </div>
  );
}

export default ListSection;
