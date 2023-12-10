import CalendarBooking from "../utils/calendar/CalendarBooking";

function MonthSection() {
  return (
    <div className="my-5">
      <h1 className="text-center max-w-lg text-xl my-10">
        My monthly calendar
      </h1>
      <div className="pl-8 md:pl-19 lg:pl-20 lg:ml-10 xl:pl-20  xl:ml-10">
        <CalendarBooking />
      </div>
    </div>
  );
}

export default MonthSection;
