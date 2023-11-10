import { useState, useEffect } from "react";
import ScheduleCardWeek from "@/components/utils/cards/ScheduleCardWeek";
import dayjs from "dayjs";
import { WEEK_DAYS } from "@/constants";
import ScheduleService from "@/services/ScheduleService";
import { toast } from "react-toastify";

function SectionWeek() {
  const [horario, setHorario] = useState([]);
  const [save, setSave] = useState(false);

  const getData = async () => {
    try {
      const response = await ScheduleService.getScheduleUser();
      if (response) {
        setHorario(response.data.schedules);
      }
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (save) {
      saveArray();
      setSave(false);
    }
  }, [horario]);

  const enableDay = async (day, active) => {
    const dayExists = horario.some((item) => item.day === day.id);
    if (dayExists) {
      const index = horario.findIndex((item) => item.day == day.id);
      if (index != -1) {
        const newHorario = [...horario];
        if (active == false || newHorario[index].intervals.length > 0) {
          setSave(true);
        }
        newHorario[index].isActive = active;
        setHorario(newHorario);
      }
    } else {
      // Crear una copia de horario y agregar un nuevo objeto
      let newHorario = [...horario];
      newHorario.push({
        day: day.id,
        intervals: [],
      });
      setHorario(newHorario);
    }
  };

  const addIntervalandVerify = async (
    dayID,
    isActive = true,
    interval,
    save = false
  ) => {
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
            day.isActive = isActive;
          } else {
            console.log("interval collides");
          }
        }
        return day;
      });
      setHorario(newHorario);
    } else {
      // Crear una copia de horario y agregar un nuevo objeto
      let newHorario = [...horario];
      newHorario.push({
        day: dayID,
        intervals: [interval],
        isActive: isActive,
      });
      setHorario(newHorario);
    }
  };
  const deleteOneBlock = (dayId, index) => {
    const dayIndex = horario.findIndex((day) => day.day === dayId);
    const newHorario = [...horario];
    newHorario[dayIndex].intervals.splice(index, 1);
    setHorario(newHorario);
  };
  const deleteInterval = (dayId, index) => {
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
  const saveArray = async () => {
    console.log("guardando en db...");
    try {
      let schedules = { schedules: horario };
      const response = await ScheduleService.save(schedules);
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
  };

  return (
    <section className="w-full max-w-lg">
      {WEEK_DAYS.map((day, index) => (
        <ScheduleCardWeek
          key={day.id}
          day={day}
          index={index}
          addInterval={addIntervalandVerify}
          enableDay={enableDay}
          deleteInterval={deleteInterval}
          deleteOneBlock={deleteOneBlock}
          horario={horario?.filter((d) => d.day === day.id)[0]}
        />
      ))}
    </section>
  );
}

export default SectionWeek;
