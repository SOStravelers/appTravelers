import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import { enUS, es, fr, de, ptBR } from "date-fns/locale";
import TimeButton from "../buttons/TimeButton";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import { Rings } from "react-loader-spinner";
import ScheduleService from "@/services/ScheduleService";
import { useStore } from "@/store";
import moment from "moment";
import { formatISO } from "date-fns";
import languageData from "@/language/reservation.json";

function Calendar({ id }) {
  const router = useRouter();
  const { service, setService, isWorker, language } = useStore();
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

  const locales = { en: enUS, es, fr, de, pt: ptBR };

  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) setFromFavorite(true);
    getSchedule();
  }, []);

  useEffect(() => {
    if (schedule.length === 0) return;
    const result = getDisabledDays(schedule);
    setDays(result);
  }, [schedule]);

  useEffect(() => {
    if (!selectedDay || schedule.length === 0) return;
    const date = new Date(selectedDay);
    const formattedDate =
      formatISO(date, { representation: "date" }) + "T00:00:00.000";
    const match = schedule.find((s) => s.day.slice(0, -1) === formattedDate);
    setIntervals(match ? match.intervals : []);
  }, [selectedDay, schedule]);

  const getSchedule = async () => {
    if (isWorker) return setLoading(false);

    const data = localStorage.getItem("fromFavorite");
    const { serviceId, subServiceId, hostelId, workerId } = service;
    const worker = data ? workerId : null;

    const response = await ScheduleService.getScheduleHostel(
      hostelId,
      serviceId,
      subServiceId,
      worker
    );
    if (response?.data) setSchedule(response.data);
    setLoading(false);
  };

  const getDisabledDays = () => {
    const sorted = [...schedule].sort(
      (a, b) => new Date(a.day) - new Date(b.day)
    );
    const firstDate = new Date(sorted[0].day);
    const lastDate = new Date(sorted[sorted.length - 1].day);
    const disabledDays = [];

    for (
      let d = new Date(firstDate);
      d <= lastDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (
        !schedule.some((obj) => new Date(obj.day).getTime() === d.getTime())
      ) {
        disabledDays.push(
          new Date(d.toISOString().split("T")[0] + "T00:00:00.000")
        );
      }
    }

    return {
      firstDate: new Date(
        firstDate.toISOString().split("T")[0] + "T00:00:00.000"
      ),
      lastDate: new Date(
        lastDate.toISOString().split("T")[0] + "T00:00:00.000"
      ),
      disabledDays,
    };
  };

  const selectTime = () => {
    const dateStr = moment(isWorker ? selectedDayWorker : selectedDay).format(
      "YYYY-MM-DD"
    );
    const now = moment();
    let startTimeIso, endTimeIso, startTime, endTime;

    if (isWorker) {
      startTimeIso = now.toISOString();
      startTime = now.format("HH:mm");
      endTimeIso = now.add(service.duration, "minutes").toISOString();
      endTime = moment(endTimeIso).format("HH:mm");
    } else {
      startTimeIso = time.startTimeIso;
      endTimeIso = time.endTimeIso;
      startTime = time.startTime;
      endTime = time.endTime;
    }
    //minicambio
    setService({
      date: dateStr,
      startTime: { isoTime: startTimeIso, stringData: startTime },
      endTime: { isoTime: endTimeIso, stringData: endTime },
    });

    if (isWorker) router.push(`/assign-client`);
    else if (fromFavorite) router.push(`/summary`);
    else router.push(`/workers-found/${id}`);
  };

  const footer = (() => {
    if (loading) {
      return (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings width={100} height={100} color="#00A0D5" ariaLabel="loading" />
          <p className="mt-2">Searching...</p>
        </div>
      );
    } else if (schedule.length === 0) {
      return (
        <div className="text-center mt-4">
          <h2 className="font-semibold text-red-500 text-sm">
            {languageData.calendar.noAvailability[language] ||
              "No available dates."}
          </h2>
        </div>
      );
    } else if (selectedDay && !isWorker) {
      return (
        <div>
          <h1 className="font-semibold text-xl mt-2">
            {languageData.calendar.chooseTime[language]}
          </h1>
          <h2 className="font-semibold text-sm mb-1">
            {languageData.calendar.timeZone[language]}
          </h2>
          <div className="w-full flex flex-wrap justify-center mb-2 mt-3 max-w-[300px] mx-auto">
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
              <span className="mt-4 text-sm text-gray-600">
                {languageData.calendar.anotherDay[language]}
              </span>
            )}
          </div>
          {time && (
            <div className="w-full flex justify-center">
              <OutlinedButton
                text={languageData.calendar.nextButton[language]}
                onClick={selectTime}
              />
            </div>
          )}
        </div>
      );
    } else if (isWorker) {
      return (
        <div className="flex flex-col items-center">
          <p className="my-4 text-lg font-semibold">
            Hora actual: {currentTime}
          </p>
          <OutlinedButton text="Continuar" onClick={selectTime} />
        </div>
      );
    }
    return null;
  })();

  return (
    <>
      {schedule.length === 0 ? (
        <div className="flex justify-center items-center">
          <DayPicker
            mode="single"
            selected={selectedDay}
            disabled={[
              { from: new Date(2000, 0, 1), to: new Date(2100, 0, 1) },
            ]}
            onSelect={setSelected}
            footer={footer}
            locale={locales[language]}
            components={{ Navbar: () => null }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <DayPicker
            mode="single"
            selected={selectedDay}
            disabled={days?.disabledDays.length > 0 ? days.disabledDays : false}
            fromDate={days?.firstDate || new Date()}
            toDate={
              days?.lastDate ||
              new Date(new Date().setMonth(new Date().getMonth() + 1))
            }
            onSelect={setSelected}
            footer={footer}
            locale={locales[language]}
          />
        </div>
      )}
    </>
  );
}

export default Calendar;
