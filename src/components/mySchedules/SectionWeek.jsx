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
      console.log("el getData");
      const response = await ScheduleService.getScheduleUser();
      console.log("la data", response.data);
      if (response) {
        console.log("wenino", response.data.schedules);
        setHorario(response.data.schedules);
      }
    } catch (err) {
      toast.error("Hubo un error inicial", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("Estado de horario actualizado:", horario);
    if (save) {
      saveArray();
      setSave(false);
    }
  }, [horario]);

  const enableDay = async (day, active) => {
    console.log("enable day");
    const dayExists = horario.some((item) => item.day === day.id);
    if (dayExists) {
      console.log("dia existe");
      const index = horario.findIndex((item) => item.day == day.id);
      console.log(index);
      if (index != -1) {
        const newHorario = [...horario];
        if (active == false || newHorario[index].intervals.length > 0) {
          setSave(true);
        }
        newHorario[index].isActive = active;
        setHorario(newHorario);
      }
    } else {
      console.log("dia nuevo");
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
            day.isActive = isActive;
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
    console.log("aqui");
    setHorario(newHorario);
  };
  const deleteInterval = (dayId, index) => {
    console.log("deleteInterval", dayId, index);
    const dayIndex = horario.findIndex((day) => day.day === dayId);
    const newHorario = [...horario];
    if (index + 1 == newHorario[dayIndex].intervals.length) {
      console.log("caso1");
      newHorario[dayIndex].intervals.splice(index, 1);
    } else {
      console.log("caso2");
      newHorario[dayIndex].intervals[index].endTime =
        newHorario[dayIndex].intervals[index + 1].endTime;
      newHorario[dayIndex].intervals.splice(index + 1, 1);
    }
    console.log("el horario", newHorario);
    setHorario(newHorario);
  };
  const saveArray = async () => {
    console.log("guardando en db...");
    try {
      let schedules = { schedules: horario };
      const response = await ScheduleService.save(schedules);
      toast.info("Horario guardado", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1200,
      });
    } catch (err) {
      toast.error("Hubo un error", {
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
