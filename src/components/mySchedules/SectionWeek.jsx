import { useState, useEffect } from "react";
import ScheduleCardWeek from "@/components/utils/cards/ScheduleCardWeek";
import { WEEK_DAYS } from "@/constants";

function SectionWeek() {
  const [horario, setHorario] = useState([]);

  useEffect(() => {
    console.log(horario);
  }, [horario]);

  const addInterval2 = (dayID, interval) => {
    const dayExists = horario.some((day) => day.day === dayID);
    if (dayExists) {
      const newHorario = horario.map((day) => {
        if (day.day === dayID) {
          day.intervals.push(interval);
        }
        return day;
      });
      setHorario(newHorario);
    } else {
      setHorario([...horario, { day: dayID, intervals: [interval] }]);
    }
  };
  const convertTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    console.log(date);
  };
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
            /*day.intervals = day.intervals.filter(
                        (i) => i.startTime !== interval.startTime && i.endTime !== interval.endTime
                    );*/
            console.log("interval reoeated");
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
    console.log(dayIndex, intervalIndex);
    const newHorario = [...horario];
    newHorario[dayIndex].intervals.splice(intervalIndex, 1);
    setHorario(newHorario);
  };

  return (
    <section>
      {WEEK_DAYS.map((day) => (
        <ScheduleCardWeek
          key={day.id}
          day={day}
          addInterval={addInterval}
          deleteInterval={deleteInterval}
          horario={horario.filter((d) => d.day === day.id)[0]}
        />
      ))}
    </section>
  );
}

export default SectionWeek;
