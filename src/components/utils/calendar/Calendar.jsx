import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import { Rings } from "react-loader-spinner";
import ScheduleService from "@/services/ScheduleService";
import { useStore } from "@/store";
import moment from "moment";
import { formatISO, sub } from "date-fns";

function Calendar({ id }) {
  const router = useRouter();
  const { service, setService, isWorker } = useStore();
  const [time, setTime] = useState();
  const [fromFavorite, setFromFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [days, setDays] = useState({
    firstDate: null,
    lastDate: null,
    disabledDays: [],
  });
  const [selectedDay, setSelected] = useState(new Date());
  const [selectedDayWorker, setSelectedWorker] = useState(new Date());
  const [intervals, setIntervals] = useState([]);
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) {
      console.log("entro");
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
    console.log("bueno");
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
    if (isWorker) {
      setLoading(false);
      return;
    }
    const data = localStorage.getItem("fromFavorite");
    const { serviceId, subServiceId, hostelId, workerId } = service;
    const worker = data ? workerId : null;
    console.log("worker", worker, "fromFavorite", data);
    const response = await ScheduleService.getScheduleHostel(
      hostelId,
      serviceId,
      subServiceId,
      worker
    );
    if (response?.data) {
      console.log("calendario", response.data);
      setSchedule(response.data);
      // setSelected(new Date());
    }
    setLoading(false);
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
  const comeBack = () => {
    router.back();
  };
  let footer = <p className="my-5"></p>;
  if (loading) {
    footer = (
      <div className="max-w-lg  flex flex-col items-center justify-center">
        <Rings
          width={100}
          height={100}
          color="#00A0D5"
          ariaLabel="infinity-spin-loading"
        />
        <p className="mt-2">Searching...</p>
      </div>
    );
  } else if (selectedDay && schedule.length > 0 && !loading && !isWorker) {
    footer = (
      <div>
        <h1 className="font-semibold text-xl mt-2">Choose de time</h1>
        <h2 className="font-semibold text-sm mb-1">Brazil time zone (GTM-3)</h2>
        <div className="w-full flex flex-wrap justify-center mb-2 mt-3">
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
            <span className="mt-4">Choose another day.</span>
          )}
        </div>
        {time && <OutlinedButton text={"Next"} onClick={selectTime} />}
      </div>
    );
  } else if (schedule.length == 0 && !loading && !isWorker) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-sm mt-2">
          Not schedule available, choose another hostel.
        </h1>
        <OutlinedButton text={"Back"} onClick={comeBack} />
      </div>
    );
  } else if (isWorker) {
    footer = (
      <div className="flex flex-col align-center justify-center">
        <p className="flex my-4 justify-center text-lg font-semibold">
          Hora actual: {currentTime}
        </p>

        <OutlinedButton text={"Siguiente"} onClick={comeBack} />
      </div>
    );
  }
  return (
    <>
      {!isWorker ? (
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
      ) : (
        <DayPicker
          mode="single"
          selected={selectedDayWorker}
          fromDate={days?.firstDate || new Date()}
          toDate={
            days?.lastDate ||
            new Date(new Date().setMonth(new Date().getMonth() + 1))
          }
          onSelect={setSelectedWorker}
          footer={footer}
        />
      )}
    </>
  );
}

export default Calendar;
