import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import ScheduleService from "@/services/ScheduleService";
import { useStore } from "@/store";
import moment from "moment";
import { formatISO } from "date-fns";

function Calendar({ id }) {
  const router = useRouter();
  const { service, setService, isWorker } = useStore();
  const [time, setTime] = useState();
  const [fromFavorite, setFromFavorite] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [days, setDays] = useState({
    firstDate: null,
    lastDate: null,
    disabledDays: [],
  });
  const [selectedDay, setSelected] = useState(new Date());
  const [intervals, setIntervals] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) {
      setFromFavorite(true);
    }
    getSchedule();
  }, []);
  useEffect(() => {
    if (schedule.length === 0) return;
    const result = schedule ? getDisabledDays(schedule) : "";
    setDays(result);
  }, [schedule]);
  useEffect(() => {
    if (selectedDay) {
      const date = new Date(selectedDay);
      const formattedDate =
        formatISO(date, { representation: "date" }) + "T00:00:00.000";
      for (let i = 0; i < schedule.length; i++) {
        let cutDate = schedule[i].day.slice(0, -1);
        if (cutDate == formattedDate) {
          setIntervals(schedule[i].intervals);
          break;
        }
      }
    }
  }, [selectedDay]);

  //Función que obtiene el schedule del hostel
  const getSchedule = async () => {
    const { serviceId, subServiceId, hostelId } = service;
    const response = await ScheduleService.getScheduleHostel(
      hostelId,
      serviceId,
      subServiceId
    );
    if (response?.data) {
      console.log("calendario", response.data);
      setSchedule(response.data);
    }
  };
  //Función que obtiene los días deshabilitados
  const getDisabledDays = () => {
    // Ordena el array por la propiedad 'day'
    schedule.sort((a, b) => new Date(a.day) - new Date(b.day));

    // Extrae la fecha del primer y último objeto
    const firstDate = new Date(schedule[0].day);
    const lastDate = new Date(schedule[schedule.length - 1].day);

    let disabledDays = [];

    // Crea un nuevo objeto Date para cada día entre las dos fechas
    for (
      let d = new Date(firstDate);
      d <= lastDate;
      d.setDate(d.getDate() + 1)
    ) {
      // Comprueba si la fecha está en el array original
      if (
        !schedule.some((obj) => new Date(obj.day).getTime() === d.getTime())
      ) {
        // Formatea la fecha y añádela al array
        let formattedDate = d.toISOString().split("T")[0] + "T00:00:00.000";
        disabledDays.push(new Date(formattedDate));
      }
    }

    // Formatea firstDate y lastDate para eliminar la 'Z' al final
    let formattedFirstDate = new Date(
      firstDate.toISOString().split("T")[0] + "T00:00:00.000"
    );
    let formattedLastDate = new Date(
      lastDate.toISOString().split("T")[0] + "T00:00:00.000"
    );

    return {
      firstDate: formattedFirstDate,
      lastDate: formattedLastDate,
      disabledDays: disabledDays,
    };
  };
  //Función que setea hora del booking
  const selectTime = () => {
    const dateStr = moment(selectedDay).format("YYYY-MM-DD");
    console.log("el tiempo", time);
    setService({
      date: dateStr,
      startTime: {
        isoTime: time.startTimeIso,
        stringData: time.startTime,
      },
      endTime: {
        isoTime: time.endTimeIso,
        stringData: time.endTime,
      },
    });
    if (fromFavorite === true) {
      router.push(`/summary`);
    } else if (isWorker) {
      router.push(`/assign-client`);
    } else if (fromFavorite === false) {
      router.push(`/workers-found/${id}`);
    }
    console.log("service", service);
  };

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selectedDay) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-2xl my-3">Time</h1>
        <div className="w-full flex flex-wrap justify-center mb-5">
          {intervals.length > 0 ? (
            intervals.map((hour, index) => (
              <TimeButton
                key={index}
                onClick={() => setTime(hour)}
                text={hour.startTime}
                selected={time === hour}
              />
            ))
          ) : (
            <span>No available time options.</span>
          )}
        </div>

        {time && <OutlinedButton text={"Next"} onClick={selectTime} />}
      </div>
    );
  }
  return (
    <DayPicker
      mode="single"
      selected={selectedDay}
      disabled={days?.disabledDays.length > 0 ? days?.disabledDays : true}
      fromDate={days?.firstDate || new Date()}
      toDate={
        days?.lastDate ||
        new Date(new Date().setMonth(new Date().getMonth() + 1))
      }
      onSelect={setSelected}
      footer={footer}
    />
  );
}

export default Calendar;
