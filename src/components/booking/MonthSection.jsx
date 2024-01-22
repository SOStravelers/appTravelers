import CalendarBooking from "../utils/calendar/CalendarBooking";

function MonthSection(day) {
  return (
    <div className="my-5">
      <h1 className="text-center text-xl my-4 max-w-lg">My monthly calendar</h1>
      <div className="flex justify-center max-w-lg">
        <CalendarBooking day={day.day} />
      </div>
    </div>
  );
}

export default MonthSection;
