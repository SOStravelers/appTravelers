import CalendarBooking from "../utils/calendar/CalendarBooking";

function MonthSection() {
  return (
    <div className="my-5">
      <h1 className="text-center max-w-lg text-xl my-10">
        My monthly calendar
      </h1>
      <div className="md:ml-16">
        <CalendarBooking />
      </div>
    </div>
  );
}

export default MonthSection;
