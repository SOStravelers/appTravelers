import { useState } from "react";
import CalendarSchedule from "@/components/utils/calendar/CalendarSchedule";

function SectionCalendar() {
  console.log("inicio");
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleDateChange(date) {
    console.log("seleccionado");
    setSelectedDate(date);
  }

  return (
    <div className="md:ml-28">
      <CalendarSchedule
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
}

export default SectionCalendar;
