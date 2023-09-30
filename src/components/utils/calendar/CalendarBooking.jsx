import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import OutlinedButton from "../buttons/OutlinedButton";
import "react-day-picker/dist/style.css";
import Link from "next/link";

import moment from "moment";

function CalendarBooking({ id }) {
  const [selected, setSelected] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

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

  const initialize = (dateString = "") => {
    const now = moment();
    if (dateString === now.format("YYYY-MM-DD") || selected === "") {
      if (!selected) setSelected(now.toDate());
      setFromDate(now.toDate());
      setToDate(now.add(2, "months").toDate());
    }
  };

  let footer = <p className="my-5">Please pick a day.</p>;
  if (selected) {
    footer = (
      <div className="w-80 mt-14">
        <Link href={`/service-history`}>
          <OutlinedButton text={"See all my records"} />
        </Link>
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

export default CalendarBooking;
