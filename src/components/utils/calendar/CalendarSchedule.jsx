import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import ScheduleCardCalendar from "../cards/ScheduleCardCalendar";
import "react-day-picker/dist/style.css";
import HollidayService from "@/services/HollidayService";
import { toast } from "react-toastify";
import { parseISO } from "date-fns";

function CalendarSchedule({ saveData }) {
  const [disabledDays, setDisabledDays] = useState([]);
  const [range, setRange] = useState(undefined);
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  useEffect(() => {
    initialize();
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await HollidayService.getHollidayUser();
      console.log("response", response.data);
      if (response && response.data && response.data.length > 0) {
        const formattedDisabledDays = response.data.map((item) => ({
          from: parseISO(item.from),
          to: parseISO(item.to),
        }));
        console.log(formattedDisabledDays);
        setDisabledDays(formattedDisabledDays);
      }
    } catch (err) {
      console.log(err);
      toast.error("Hubo un error inicial", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    }
  };

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
    let totalDays = [...disabledDays];
    console.log("cancel", totalDays);
    const newDisabledDays = totalDays.filter(
      (day) => day.from !== range.from && day.to !== range.to
    );
    await saveData(newDisabledDays);
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
      {disabledDays && disabledDays.length > 0
        ? disabledDays.map((item, index) => (
            <ScheduleCardCalendar
              key={index}
              text={`${
                item.from && item.to
                  ? format(new Date(item.from), "PP") +
                    "–" +
                    format(new Date(item.to), "PP")
                  : "Invalid Date Range"
              }`}
              cancel={() => handleCancel(item)}
            />
          ))
        : null}
    </>
  );
}

export default CalendarSchedule;
