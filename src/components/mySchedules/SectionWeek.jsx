import { useState, useEffect } from "react";
import ScheduleCardWeek from "@/components/utils/cards/ScheduleCardWeek";
import dayjs from "dayjs";
import { WEEK_DAYS } from "@/constants";

function SectionWeek() {
  const [horario, setHorario] = useState([]);

  function convertToValidTimeFormat(value) {
    return dayjs(value).format("HH:mm");
  }

  const addInterval = (dayID, interval) => {
    console.log("addInterval");
    const dayExists = horario.some((day) => day.day === dayID);
    if (dayExists) {
      const newHorario = horario.map((day) => {
        if (day.day === dayID) {
          const intervalExists = day.intervals.some(
            (i) =>
              i.startTime === interval.startTime &&
              i.endTime === interval.endTime
          );
          if (!intervalExists) {
            day.intervals.push(interval);
          } else {
            console.log("interval repeated");
          }
        }
        return day;
      });
      setHorario(newHorario);
    } else {
      setHorario([...horario, { day: dayID, intervals: [interval] }]);
    }
  };
  const addIntervalandVerify = (dayID, interval) => {
    console.log("addIntervalVerify", dayID, interval);
    console.log(horario);
    const dayExists = horario.some((day) => day.day === dayID);
    if (dayExists) {
      console.log("dayExists", dayExists);
      const newHorario = horario.map((day) => {
        if (day.day === dayID) {
          console.log("wena", day.intervals);
          const intervalCollides = day.intervals.some(
            (i) =>
              i.startTime <= interval.startTime &&
              i.startTime <= interval.endTime &&
              interval.startTime <= interval.startTime
          );
          if (intervalCollides || day.intervals.length == 0) {
            console.log("bien");
            day.intervals.push(interval);
          } else {
            console.log("interval collides");
          }
        }
        return day;
      });
      setHorario(newHorario);
      console.log(newHorario);
    } else {
      console.log("day no exisst");
      console.log({ day: dayID, intervals: [interval] });
      setHorario([...horario, { day: dayID, intervals: [interval] }]);
    }
  };

  const deleteInterval = (dayId, index) => {
    console.log("deleteInterval");
    const dayIndex = horario.findIndex((day) => day.day === dayId);

    const newHorario = [...horario];
    console.log("wena0", newHorario);
    console.log("wena1", newHorario[dayIndex].intervals[index]);
    console.log("wena2", newHorario[dayIndex].intervals[index + 1]);
    if (index + 1 == newHorario[dayIndex].intervals.length) {
      newHorario[dayIndex].intervals.splice(index, 1);
    } else {
      newHorario[dayIndex].intervals[index].endTime =
        newHorario[dayIndex].intervals[index + 1].endTime;
      newHorario[dayIndex].intervals.splice(index + 1, 1);
    }
    setHorario(newHorario);
  };

  return (
    <section className="w-full max-w-lg">
      {WEEK_DAYS.map((day, index) => (
        <ScheduleCardWeek
          key={day.id}
          day={day}
          index={index}
          addInterval={addIntervalandVerify}
          deleteInterval={deleteInterval}
          horario={horario.filter((d) => d.day === day.id)[0]}
        />
      ))}
    </section>
  );
}

export default SectionWeek;
