import CalendarBooking from "../utils/calendar/CalendarBooking";

function MonthSection() {
  return (
    <div className="my-5">
      <h1 className="text-center text-xl my-10">My monthly calendar</h1>
      <CalendarBooking />
    </div>
  );
}

export default MonthSection;
