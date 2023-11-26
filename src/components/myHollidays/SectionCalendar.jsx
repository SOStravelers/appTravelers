import { useState } from "react";
import CalendarSchedule from "@/components/utils/calendar/CalendarSchedule";
import { toast } from "react-toastify";
import HollidayService from "@/services/HollidayService";

function SectionCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleDateChange(date) {
    setSelectedDate(date);
  }
  async function saveData(data) {
    let hollidays = { range: data };
    return console.log(hollidays);
    const response = await HollidayService.save(hollidays);
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
