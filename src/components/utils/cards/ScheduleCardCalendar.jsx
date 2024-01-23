import React from "react";
import { CloseIcon } from "@/constants/icons";

function ScheduleCardCalendar({ text, confirm, cancel }) {
  return (
    <div className="border-blueBorder border p-3 my-2 rounded-2xl flex justify-between items-center">
      <p className="text-xs">{text}</p>
      {confirm && (
        <button
          className="bg-blueBorder text-white rounded-lg text-xs py-1 px-2"
          onClick={confirm}
        >
          Confirmar
        </button>
      )}
      {cancel && <CloseIcon onClick={cancel} />}
    </div>
  );
}

export default ScheduleCardCalendar;
