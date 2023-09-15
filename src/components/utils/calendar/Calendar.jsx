import { useEffect, useState } from "react";

import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import SolidButton from "../buttons/SolidButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";

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
  const [selected, setSelected] = useState();
  const [time, setTime] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [hours, setHours] = useState();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const initialize = () => {
    const now = moment();
    setSelected(now.toDate());
    setFromDate(now.toDate());
    setToDate(now.add(2, "months").toDate());
    const nhs = now.add(2, "hours").format("hh:mm a");
    const hours = HOURS.filter((h) => {
      const nh = moment(nhs, "hh:mm a");
      const mh = moment(h, "hh:mm a");

      return mh > nh;
    });
    setHours(hours);
  };

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selected) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-2xl my-3">Time</h1>
        <div className="w-80 flex flex-wrap justify-center mb-5">
          {hours.map((hour) => (
            <TimeButton
              key={hour}
              onClick={() => setTime(hour)}
              text={hour}
              selected={time === hour}
            />
          ))}
        </div>
        {time && (
          <Link href={`/workers-found/${id}`}>
            <SolidButton text={"Next"} />
          </Link>
        )}
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
