import { useState, useEffect } from "react";
import ScheduleCardWeek from "@/components/utils/cards/ScheduleCardWeek";
import dayjs from "dayjs";
import { WEEK_DAYS } from "@/constants";
import { toast } from "react-toastify";

function SectionWeek() {
  const [horario, setHorario] = useState([]);
  const [save, setSave] = useState(false);

  useEffect(() => {
    console.log("Estado de horario actualizado:", horario);
    console.log(save);
    if (save) {
      saveArray();
      setSave(false);
    }
  }, [horario]);

  const addIntervalandVerify = async (dayID, interval, save = false) => {
    console.log("addIntervalVerify", dayID, interval);
    setSave(save);
    const dayExists = horario.some((day) => day.day === dayID);
    if (dayExists) {
      const newHorario = horario.map((day) => {
        if (day.day === dayID) {
          const intervalCollides = day.intervals.some(
            (i) =>
              i.startTime <= interval.startTime &&
              i.startTime <= interval.endTime &&
              interval.startTime <= interval.startTime
          );
          if (intervalCollides || day.intervals.length == 0) {
            day.intervals.push(interval);
          } else {
            console.log("interval collides");
          }
        }
        return day;
      });
      setHorario(newHorario);
    } else {
      console.log("dia nuevo");
      // Crear una copia de horario y agregar un nuevo objeto
      let newHorario = [...horario];
      newHorario.push({ day: dayID, intervals: [interval] });
      setHorario(newHorario);
    }
  };
  const saveArray = () => {
    console.log("guardando en db...");
    console.log(horario);
    toast.info("Horario guardado", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1200,
    });
  };

  const deleteInterval = (dayId, index) => {
    console.log("deleteInterval");
    const dayIndex = horario.findIndex((day) => day.day === dayId);
    const newHorario = [...horario];
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
          horario={horario?.filter((d) => d.day === day.id)[0]}
        />
      ))}
    </section>
  );
}

export default SectionWeek;
