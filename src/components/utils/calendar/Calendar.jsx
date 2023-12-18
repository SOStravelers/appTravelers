"useClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import ScheduleService from "@/services/ScheduleService";
import { useStore } from "@/store";
import moment from "moment";
import { set, setDay, parseISO, formatISO } from "date-fns";
import { da } from "date-fns/locale";

function Calendar({ id }) {
  const router = useRouter();
  const { service, setService, isWorker } = useStore();
  const [selected, setSelected] = useState("");
  const [time, setTime] = useState();
  const [fromFavorite, setFromFavorite] = useState(false);
  const [data, setData] = useState([]);
  const [days, setDays] = useState([]);
  const [intervals, setIntervals] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) {
      setFromFavorite(true);
    }
    getSchedule();
  }, []);

  useEffect(() => {
    if (selected) {
      const date = new Date(selected);
      const formattedDate =
        formatISO(date, { representation: "date" }) + "T00:00:00.000";
      for (let i = 0; i < data.length; i++) {
        let cutDate = data[i].day.slice(0, -1);
        if (cutDate == formattedDate) {
          setIntervals(data[i].intervals);
          break;
        }
      }
    }
  }, [selected]);

  const selectTime = () => {
    console.log("selectTimess", selected, time);
    const dateStr = moment(selected).format("YYYY-MM-DD");
    setService({
      date: dateStr,
      hour: time.startTime,
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

  useEffect(() => {
    if (data.length === 0) return;
    const result = data ? getDisabledDays(data) : "";
    setDays(result);
  }, [data]);

  const getSchedule = async () => {
    const { serviceId, subServiceId, hostelId } = service;
    const response = await ScheduleService.getScheduleHostel(
      hostelId,
      serviceId,
      subServiceId
    );
    if (response?.data) {
      setData(response.data);
    }
  };
  function getDisabledDays(data) {
    // Ordena el array por la propiedad 'day'
    data.sort((a, b) => new Date(a.day) - new Date(b.day));

    // Extrae la fecha del primer y último objeto
    const firstDate = new Date(data[0].day);
    const lastDate = new Date(data[data.length - 1].day);

    let disabledDays = [];

    // Crea un nuevo objeto Date para cada día entre las dos fechas
    for (
      let d = new Date(firstDate);
      d <= lastDate;
      d.setDate(d.getDate() + 1)
    ) {
      // Comprueba si la fecha está en el array original
      if (!data.some((obj) => new Date(obj.day).getTime() === d.getTime())) {
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
  }

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selected) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-2xl my-3">Time</h1>
        <div className="w-full flex flex-wrap justify-center mb-5">
          {intervals.map((hour, index) => (
            <TimeButton
              key={index}
              onClick={() => setTime(hour)}
              text={hour.startTime}
              selected={time === hour}
            />
          ))}
        </div>
        {time && <OutlinedButton text={"Next"} onClick={selectTime} />}
      </div>
    );
  }
  return (
    <DayPicker
      mode="single"
      selected={selected}
      disabled={days.disabledDays}
      fromDate={days.firstDate}
      toDate={days.lastDate}
      onSelect={setSelected}
      footer={footer}
    />
  );
}

export default Calendar;
