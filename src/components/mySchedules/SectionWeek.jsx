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
    const dayExists = horario.some((day) => day.day === dayID);
    if (dayExists) {
      const newHorario = horario.map((day) => {
        if (day.day === dayID) {
          const intervalCollides = day.intervals.some(
            (i) =>
              (i.startTime <= interval.startTime &&
                i.endTime >= interval.startTime) ||
              (i.startTime <= interval.endTime && i.endTime >= interval.endTime)
          );
          if (!intervalCollides) {
            day.intervals.push(interval);
          } else {
            console.log("interval collides");
          }
        }
        return day;
      });
      setHorario(newHorario);
    } else {
      setHorario([...horario, { day: dayID, intervals: [interval] }]);
    }
  };

  const deleteInterval = (dayId, interval) => {
    const dayIndex = horario.findIndex((day) => day.day === dayId);
    const intervalIndex = horario[dayIndex].intervals.findIndex(
      (i) =>
        i.startTime === interval.startTime && i.endTime === interval.endTime
    );
    const newHorario = [...horario];
    newHorario[dayIndex].intervals.splice(intervalIndex, 1);
    setHorario(newHorario);
  };

  return (
    <section className="w-full">
      {WEEK_DAYS.map((day) => (
        <ScheduleCardWeek
          key={day.id}
          day={day}
          addInterval={addIntervalandVerify}
          deleteInterval={deleteInterval}
          horario={horario.filter((d) => d.day === day.id)[0]}
        />
      ))}
    </section>
  );
}

export default SectionWeek;
