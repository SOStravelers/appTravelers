import { useState } from "react";
import CalendarSchedule from "@/components/utils/calendar/CalendarSchedule";
import { toast } from "react-toastify";

function SectionCalendar() {
  console.log("inicio");
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleDateChange(date) {
    console.log("seleccionado");
    setSelectedDate(date);
  }
  function saveData(data) {
    console.log("wenazo", data);
    // let schedules = { schedules: horario };
    // const response = await ScheduleService.save(schedules);
    try {
      toast.info("Saved", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1200,
      });
    } catch (err) {
      toast.error("Save failed.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    }
  }

  return (
    <div className="md:ml-28">
      <CalendarSchedule
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        saveData={saveData}
      />
    </div>
  );
}

export default SectionCalendar;
