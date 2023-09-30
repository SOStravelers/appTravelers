import CalendarBookingWorker from "@/components/utils/calendar/CalendarBookingWorker";

function MonthSection() {
  return (
    <div className="my-5">
      <h1 className="text-center text-xl my-10">My monthly calendar</h1>
      <CalendarBookingWorker />
    </div>
  );
}

export default MonthSection;
