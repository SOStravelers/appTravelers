import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import { AlertIcon } from "@/constants/icons";
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
import { formatearFechaCompletaDesdeISO } from "@/utils/format";
function Calendar({ id }) {
  const router = useRouter();
  const { service, setService, isWorker, language, currency } = useStore();

  // time selection
  const [time, setTime] = useState();
  // schedule fetch & state
  const [fromFavorite, setFromFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [days, setDays] = useState({
    firstDate: null,
    lastDate: null,
    disabledDays: [],
  });
  const [selectedDay, setSelected] = useState(new Date());
  const [selectedDayWorker] = useState(new Date());
  const [intervals, setIntervals] = useState([]);

  // guest counts
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [totalAmount, setTotalAmount] = useState(1);

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const locales = { en: enUS, es, fr, de, pt: ptBR };

  // adjust adults count
  const incAdults = () => {
    if (
      service?.tourData?.hasLimit &&
      service?.tourData?.limit &&
      totalAmount >= service?.tourData?.limit
    )
      return;
    const v = adults + 1;
    setAdults(v);
    setTotalAmount(v + children);
  };
  const decAdults = () => {
    console.log("dec adult", totalAmount);
    if (adults > 1) {
      const v = adults - 1;
      setAdults(v);
      setTotalAmount(v + children);
    }
  };

  // adjust children count
  const incChildren = () => {
    console.log("inc child", totalAmount);
    if (
      service?.tourData?.hasLimit &&
      service?.tourData?.limit &&
      totalAmount >= service?.tourData?.limit
    )
      return;
    const v = children + 1;
    setChildren(v);
    setTotalAmount(v + adults);
  };
  const decChildren = () => {
    console.log("dec child", totalAmount);
    if (children > 0) {
      const v = children - 1;
      setChildren(v);
      setTotalAmount(v + adults);
    }
  };

  // fetch schedule on mount
  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) setFromFavorite(true);
    getSchedule();
  }, []);

  // when schedule loaded, compute disabled days
  useEffect(() => {
    if (!schedule.length) return;
    setDays(computeDisabledDays());
  }, [schedule]);

  // when day changes, pick its intervals
  useEffect(() => {
    if (!selectedDay || !schedule.length) return;
    setTime();
    console.log("selectDay", selectedDay);
    const date = new Date(selectedDay);
    const isoDay =
      formatISO(date, { representation: "date" }) + "T00:00:00.000";
    const match = schedule.find((s) => s.day.slice(0, -1) === isoDay);
    setIntervals(match ? match.intervals : []);
  }, [selectedDay, schedule]);

  const getSchedule = async () => {
    if (isWorker) {
      setLoading(false);
      return;
    }
    const data = localStorage.getItem("fromFavorite");
    const res = await ScheduleService.getScheduleHostel(
      null,
      service.service._id,
      service._id,
      null
    );
    if (res?.data) setSchedule(res.data);
    setLoading(false);
  };

  const computeDisabledDays = () => {
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
      if (!schedule.some((s) => new Date(s.day).getTime() === d.getTime())) {
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
    const nowMoment = moment();
    let startTimeIso, endTimeIso, startTime, endTime;

    if (isWorker) {
      startTimeIso = nowMoment.toISOString();
      startTime = nowMoment.format("HH:mm");
      endTimeIso = nowMoment.add(service.duration, "minutes").toISOString();
      endTime = moment(endTimeIso).format("HH:mm");
    } else {
      startTimeIso = time.startTimeIso;
      endTimeIso = time.endTimeIso;
      startTime = time.startTime;
      endTime = time.endTime;
    }

    const totalA = adults * service.tourData.adultPrice[currency].value;
    const totalC = children * service.tourData.childrenPrice[currency].value;
    const total = totalA + totalC;

    setService({
      ...service,
      date: dateStr,
      startTime: { isoTime: startTimeIso, stringData: startTime },
      endTime: { isoTime: endTimeIso, stringData: endTime },
      selectedData: {
        amountAdults: adults,
        amountChildren: children,
        totalAmount: children + adults,
        totalAdult: totalA,
        totalChildren: totalC,
        totalPrice: total,
      },
    });

    router.push(`/summary2/confirm-selection/${id}`);
    // if (isWorker) router.push(`/assign-client`);
    // else if (fromFavorite) router.push(`/summary-mini`);
    // else router.push(`/workers-found/${id}`);
  };

  const footer = () => {
    if (loading) {
      return (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings width={100} height={100} color="#00A0D5" ariaLabel="loading" />
          <p className="mt-2">Searching...</p>
        </div>
      );
    }
    if (!schedule.length) {
      return (
        <div className="text-center mt-4">
          <h2 className="font-semibold text-red-500 text-sm">
            {languageData.calendar.noAvailability[language] ||
              "No available dates."}
          </h2>
        </div>
      );
    }
    if (selectedDay && !isWorker) {
      return (
        <div>
          <h1 className="font-semibold text-xs mt-2">
            {languageData.calendar.chooseTime[language]}
          </h1>
          <h2 className="font-semibold text-xs mb-1">
            {languageData.calendar.timeZone[language]}
          </h2>
          <div className="w-full flex flex-wrap justify-center mb-2 mt-3 max-w-[200px] mx-auto">
            {intervals.length ? (
              intervals.map((hour) => (
                <>
                  {/* <p>{hour.startTimeIso}</p> */}
                  <TimeButton
                    key={hour.startTimeIso}
                    onClick={() => setTime(hour)}
                    text={
                      formatearFechaCompletaDesdeISO(
                        hour.startTimeIso,
                        language,
                        "br"
                      ).stringData
                    }
                    selected={time === hour}
                  />
                </>
              ))
            ) : (
              <span className="mt-4 text-sm text-gray-600">
                {languageData.calendar.anotherDay[language]}
              </span>
            )}
          </div>
          <div className="w-full flex justify-center">
            {time ? (
              <button
                onClick={selectTime}
                className={`block w-1/2 mx-auto text-white text-xs px-2 py-2 rounded-full bg-darkBlue hover:bg-blueBorderLight
             `}
              >
                {languageData.calendar.applyButton[language]}
              </button>
            ) : (
              <div className="block w-1/2 mx-auto text-white text-xs px-2 py-4 rounded-full " />
            )}
          </div>
        </div>
      );
    }
    if (isWorker) {
      return (
        <div className="flex flex-col items-center">
          <p className="my-4 text-sm font-semibold">
            Hora actual: {currentTime}
          </p>
          <OutlinedButton text="Continuar" onClick={selectTime} />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Guests selector */}
      {service.typeService === "tour" && (
        <div className="w-full max-w-lg mx-auto mb-6 space-y-4">
          {/* Adults */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold">Adultos</h3>
              <p className="text-xs text-gray-500">Edad: más de 18</p>
            </div>
            <div className="flex items-center justify-center items-center">
              <button
                onClick={decAdults}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                –
              </button>
              <span className="w-8 text-sm flex items-center justify-center">
                {adults}
              </span>
              <button
                onClick={incAdults}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>
          {/* Children */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold">Niños</h3>
              <p className="text-xs text-gray-500">Edad: 2–12 años</p>
            </div>
            <div className="flex items-center justify-center items-center">
              <button
                onClick={decChildren}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                –
              </button>
              <span className="w-8 flex items-center justify-center text-sm">
                {children}
              </span>
              <button
                onClick={incChildren}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-3 mt-1 ">
        <AlertIcon className="mr-2" />
        <h2 className="font-semibold text-xs">
          {languageData.selectDate[language]}
        </h2>
        {/* ❌ Botón de cerrar */}
        {/* <button
            onClick={onClose}
            className="absolute  right-3 text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button> */}
      </div>

      {/* Calendar */}
      <div className="flex justify-center items-center">
        <DayPicker
          mode="single"
          className="mini-calendar"
          selected={selectedDay}
          disabled={
            schedule.length === 0
              ? [{ from: new Date(2000, 0, 1), to: new Date(2100, 0, 1) }]
              : days.disabledDays
          }
          fromDate={schedule.length ? days.firstDate : undefined}
          toDate={
            schedule.length
              ? days.lastDate
              : new Date(new Date().setMonth(new Date().getMonth() + 1))
          }
          onSelect={setSelected}
          footer={footer()}
          locale={locales[language]}
          components={schedule.length ? {} : { Navbar: () => null }}
        />
      </div>
    </>
  );
}

export default Calendar;
