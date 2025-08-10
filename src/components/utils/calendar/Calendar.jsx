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
import { formatISO, addMonths } from "date-fns";
import languageData from "@/language/reservation.json";
import { FiInfo } from "react-icons/fi";
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
    extendedLastDate: null,
    disabledDays: [],
  });
  const [selectedDay, setSelected] = useState(new Date());
  const [intervals, setIntervals] = useState([]);

  // guest counts
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [totalAmount, setTotalAmount] = useState(1);

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
    if (adults > 1) {
      const v = adults - 1;
      setAdults(v);
      setTotalAmount(v + children);
    }
  };

  // adjust children count
  const incChildren = () => {
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
    if (children > 0) {
      const v = children - 1;
      setChildren(v);
      setTotalAmount(v + adults);
    }
  };

  // fetch schedule on mount
  useEffect(() => {
    getSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const date = new Date(selectedDay);
    const isoDay =
      formatISO(date, { representation: "date" }) + "T00:00:00.000";
    const match = schedule.find((s) => s.day.slice(0, -1) === isoDay);
    setIntervals(match ? match.intervals : []);
  }, [selectedDay, schedule]);

  const getSchedule = async () => {
    const res = await ScheduleService.getScheduleHostel(
      null,
      service.service._id,
      service._id,
      null
    );
    if (res?.data) setSchedule(res.data);
    setLoading(false);
  };

  // 👉 Extiende SIEMPRE hasta hoy + 6 meses (no desde la última fecha del schedule)
  const computeDisabledDays = (extendMonths = 8) => {
    const sorted = [...schedule].sort(
      (a, b) => new Date(a.day) - new Date(b.day)
    );

    const norm = (d) =>
      new Date(new Date(d).toISOString().split("T")[0] + "T00:00:00.000");

    const firstDate = norm(sorted[0].day);
    const lastDate = norm(sorted[sorted.length - 1].day);
    const extendedLastDate = norm(addMonths(new Date(), extendMonths)); // ← hoy + 6m

    // Set de fechas habilitadas por schedule
    const scheduledSet = new Set(schedule.map((s) => norm(s.day).getTime()));

    const disabledDays = [];
    // si firstDate estuviera después de extendedLastDate, no iteramos
    if (firstDate <= extendedLastDate) {
      for (
        let d = new Date(firstDate);
        d <= extendedLastDate;
        d.setDate(d.getDate() + 1)
      ) {
        const t = d.getTime();
        if (!scheduledSet.has(t)) {
          disabledDays.push(new Date(d));
        }
      }
    }

    return { firstDate, lastDate, extendedLastDate, disabledDays };
  };

  const selectTime = () => {
    const startTimeIso = time.startTimeIso;
    const endTimeIso = time.endTimeIso;

    const totalA = adults * service.tourData.adultPrice[currency];
    const totalC = children * service.tourData.childrenPrice[currency];
    const total = totalA + totalC;

    const data = formatearFechaCompletaDesdeISO(startTimeIso, language);
    const endData = formatearFechaCompletaDesdeISO(endTimeIso, language);

    setService({
      ...service,
      startTime: {
        isoTime: startTimeIso,
        formatedDate: data.formatedDate,
        formatedTime: data.formatedTime,
      },
      endTime: {
        isoTime: endTimeIso,
        formatedDate: endData.formatedDate,
        formatedTime: endData.formatedTime,
      },
      selectedData: {
        amountAdults: adults,
        amountChildren: children,
        totalAmount: children + adults,
        totalAdult: totalA,
        totalChildren: totalC,
        totalPrice: total,
      },
      totalPrice: total,
    });

    router.push(`/summary2/confirm-selection/${id}`);
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
    return (
      <div>
        <h1 className="font-semibold text-xs mt-2 text-textColor">
          {languageData.calendar.chooseTime[language]}
        </h1>
        <h2 className="font-semibold text-xs mb-1 text-textColor">
          {languageData.calendar.timeZone[language]}
        </h2>
        <div className="w-full flex flex-wrap justify-center mb-2 mt-3 max-w-[200px] mx-auto">
          {intervals.length ? (
            intervals.map((hour) => (
              <TimeButton
                key={`${selectedDay}-${hour.startTimeIso}`}
                onClick={() => setTime(hour)}
                text={
                  formatearFechaCompletaDesdeISO(
                    hour.startTimeIso,
                    language,
                    "br"
                  ).formatedTime
                }
                selected={time === hour}
              />
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
              className="block w-1/2 mx-auto text-white text-xs px-2 py-2 rounded-full bg-darkBlue hover:bg-blueBorderLight"
            >
              {languageData.calendar.applyButton[language]}
            </button>
          ) : (
            <div className="block w-1/2 mx-auto text-white text-xs px-2 py-4 rounded-full " />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Guests selector */}
      {service.typeService === "tour" && service.tourData && (
        <div className="w-full max-w-sm mt-4 mx-auto mb-6 space-y-4">
          {/* Adults */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-textColor font-semibold">
                {service.tourData.hasChildren
                  ? languageData.calendar.adults[language]
                  : languageData.calendar.people[language]}
              </h3>
            </div>
            <div className="flex items-center justify-center items-center">
              <button
                onClick={decAdults}
                className="w-7 h-7 rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-sm text-textColor">-</p>
              </button>
              <span className="w-8 text-sm flex items-center justify-center text-textColor">
                {adults}
              </span>
              <button
                onClick={incAdults}
                className="w-7 h-7 rounded-full bg-buttonGray flex items-center justify-center text-sm"
              >
                <p className="text-sm text-textColor">+</p>
              </button>
            </div>
          </div>
          {/* Children */}
          {service.tourData.hasChildren && (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-textColor">
                  {languageData.calendar.children[language]}
                </h3>
                <p className="text-xs text-textColor">
                  {languageData.calendar.ageRange_2_12[language]}
                </p>
              </div>
              <div className="flex items-center justify-center items-center">
                <button
                  onClick={decChildren}
                  className="w-7 h-7 rounded-full bg-buttonGray flex items-center justify-center text-sm"
                >
                  <p className="text-sm text-textColor">-</p>
                </button>
                <span className="w-8 flex items-center justify-center text-sm text-textColor">
                  {children}
                </span>
                <button
                  onClick={incChildren}
                  className="w-7 h-7 rounded-full bg-buttonGray flex items-center justify-center text-sm"
                >
                  <p className="text-sm text-textColor">+</p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center mb-3 mt-1 ">
        <FiInfo className="text-textColor text-xl mr-2" />
        <h2 className="font-semibold text-xs text-textColor">
          {languageData.selectDate[language]}
        </h2>
      </div>

      {/* Calendar */}
      <div className="flex justify-center items-center">
        <DayPicker
          mode="single"
          className="mini-calendar"
          selected={selectedDay}
          disabled={
            schedule.length === 0
              ? [{ from: new Date(2000, 0, 1), to: addMonths(new Date(), 6) }]
              : days.disabledDays
          }
          fromDate={schedule.length ? days.firstDate : undefined}
          toDate={
            schedule.length ? days.extendedLastDate : addMonths(new Date(), 6)
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
