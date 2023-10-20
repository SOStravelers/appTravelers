import CalendarBookingWorker from "@/components/utils/calendar/CalendarBookingWorker";

function MonthSection() {
  return (
    <div className="my-5">
      <h1 className="text-center text-xl my-10 max-w-lg">
        My monthly calendar
      </h1>
      <div className="flex justify-center max-w-lg">
        <CalendarBookingWorker />
      </div>
    </div>
  );
}

export default MonthSection;
