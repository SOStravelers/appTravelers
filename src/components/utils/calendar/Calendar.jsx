import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import TimeButton from "../buttons/TimeButton";
import SolidButton from "../buttons/SolidButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";

const HOURS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function Calendar() {
  const [selected, setSelected] = useState();
  const [time, setTime] = useState();

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selected) {
    footer = (
      <div>
        {/*<p className="my-5">You picked {format(selected, "PP")}.</p>*/}
        <h1 className="font-semibold text-2xl my-3">Time</h1>
        <div className="w-80 flex flex-wrap justify-center mb-5">
          {HOURS.map((hour) => (
            <TimeButton
              key={hour}
              onClick={() => setTime(hour)}
              text={hour}
              selected={time === hour}
            />
          ))}
        </div>
        {time && (
          <Link href={"/workers-found"}>
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
      footer={footer}
    />
  );
}

export default Calendar;
