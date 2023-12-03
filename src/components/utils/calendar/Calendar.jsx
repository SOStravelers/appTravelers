import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";

import { useStore } from "@/store";
import moment from "moment";

const HOURS = [
  "9:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "1:00 pm",
  "2:00 pm",
  "3:00 pm",
  "4:00 pm",
  "5:00 pm",
  "6:00 pm",
  "7:00 pm",
  "8:00 pm",
  "9:00 pm",
];

function Calendar({ id }) {
  const router = useRouter();
  const { setService, isWorker } = useStore();

  const [selected, setSelected] = useState("");
  const [time, setTime] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [hours, setHours] = useState();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (selected) {
      const dateString = moment({
        year: selected.getFullYear(),
        month: selected.getMonth(),
        day: selected.getDate(),
      }).format("YYYY-MM-DD");
      initialize(dateString);
    }
  }, [selected]);

  const select = () => {
    const dateStr = moment(selected).format("YYYY-MM-DD");
    setService({
      date: dateStr,
      hour: time,
    });
    if (isWorker) router.push(`/assign-client`);
    else router.push(`/workers-found/${id}`);
  };

  const initialize = (dateString = "") => {
    let hours = [];
    const now = moment();
    if (dateString === now.format("YYYY-MM-DD") || selected === "") {
      if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(2, "months").toDate());
      const nhs = now.add(2, "hours").format("hh:mm a");
      hours = HOURS.filter((h) => {
        const nh = moment(nhs, "hh:mm a");
        const mh = moment(h, "hh:mm a");

        return mh > nh;
      });
    } else {
      hours = HOURS.slice();
    }
    setHours(hours);
  };

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selected) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-2xl my-3">Time</h1>
        <div className="w-full flex flex-wrap justify-center mb-5">
          {hours.map((hour) => (
            <TimeButton
              key={hour}
              onClick={() => setTime(hour)}
              text={hour}
              selected={time === hour}
            />
          ))}
        </div>
        {time && <OutlinedButton text={"Next"} onClick={select} />}
      </div>
    );
  }
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      fromDate={fromDate}
      toDate={toDate}
      footer={footer}
    />
  );
}

export default Calendar;
