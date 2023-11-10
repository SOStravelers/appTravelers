import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import ScheduleCardCalendar from "../cards/ScheduleCardCalendar";
import "react-day-picker/dist/style.css";

function CalendarSchedule() {
  const [disabledDays, setDisabledDays] = useState([]);
  const [range, setRange] = useState(undefined);
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    initialize();
  }, []);
  const initialize = (dateString = "") => {
    const now = moment();
    if (dateString === now.format("YYYY-MM-DD") || selected === "") {
      if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(6, "months").toDate());
    }
  };

  const handleSelection = () => {
    console.log("seleccion");
    setDisabledDays([...disabledDays, range]);
    setRange(undefined);
  };

  const handleCancel = (range) => {
    console.log("cancel");
    const newDisabledDays = disabledDays.filter(
      (day) => day.from !== range.from && day.to !== range.to
    );
    setDisabledDays(newDisabledDays);
  };

  let footer = <p className="my-5 text-center">Please pick a day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <ScheduleCardCalendar text={format(range.from, "PP")} />;
    } else if (range.to) {
      footer = (
        <ScheduleCardCalendar
          text={`${format(range.from, "PP")}–${format(range.to, "PP")}`}
          confirm={handleSelection}
        />
      );
    }
  }

  return (
    <>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        fromDate={fromDate}
        toDate={toDate}
        footer={footer}
        disabled={disabledDays}
      />
      {disabledDays.map((day, index) => (
        <ScheduleCardCalendar
          key={index}
          text={`${format(day.from, "PP")}–${format(day.to, "PP")}`}
          cancel={() => handleCancel(day)}
        />
      ))}
    </>
  );
}

export default CalendarSchedule;
