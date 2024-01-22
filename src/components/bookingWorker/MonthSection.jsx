import CalendarBookingWorker from "../utils/calendar/CalendarBookingWorker";

function MonthSection(day) {
  return (
    <div className="my-5 ">
      <h1 className="text-center text-xl my-10 max-w-lg">
        Meu calendário mensal
      </h1>
      <div className=" max-w-lg">
        <CalendarBookingWorker day={day.day} />
      </div>
    </div>
  );
}

export default MonthSection;
