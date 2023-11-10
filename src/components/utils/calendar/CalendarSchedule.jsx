import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import ScheduleCardCalendar from "../cards/ScheduleCardCalendar";
import "react-day-picker/dist/style.css";

function CalendarSchedule({ saveData }) {
  const [disabledDays, setDisabledDays] = useState([]);
  const [range, setRange] = useState(undefined);
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    initialize();
  }, []);
  useEffect(() => {
    console.log("perro", disabledDays);
  }, [disabledDays]);
  const initialize = (dateString = "") => {
    const now = moment();
    if (dateString === now.format("YYYY-MM-DD") || selected === "") {
      if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(6, "months").toDate());
    }
  };
  const formatDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleSelection = async () => {
    const dateFrom = formatDate(range.from);
    const dateTo = formatDate(range.to);
    let totalDays = [...disabledDays];
    if (totalDays?.length > 0) {
      var guardado = false;
      for (let index = 0; index < totalDays.length; index++) {
        const item = totalDays[index];
        const itemFrom = formatDate(item.from);
        const itemTo = formatDate(item.to);
        if (dateFrom < itemFrom && dateTo > itemTo) {
          totalDays.splice(index, 1);
          if (!guardado) {
            totalDays[index] = range;
            guardado = true;
          }
        } else {
          totalDays.push(range);
          break;
        }
      }
      const rangosOrdenados = totalDays
        .slice()
        .sort((a, b) => new Date(a.from) - new Date(b.from));
      setDisabledDays(rangosOrdenados);
      await saveData(rangosOrdenados);
    } else {
      const nuevoRango = [range];
      setDisabledDays(nuevoRango);
      await saveData(nuevoRango);
    }
    setRange(undefined);
  };

  const handleCancel = async (range) => {
    console.log("cancel");
    const newDisabledDays = disabledDays.filter(
      (day) => day.from !== range.from && day.to !== range.to
    );
    await saveData(newDisabledDays);
    setDisabledDays(newDisabledDays);
    console.log("disableDay", disabledDays);
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
