import React from "react";
import { CloseIcon } from "@/constants/icons";

function ScheduleCardCalendar() {
  return (
    <div className="border-blueBorder border p-3 rounded-2xl flex justify-between items-center">
      <p>fecha a fecha</p>
      <button className="bg-blueBorder text-white rounded-lg text-xs py-1 px-2">
        Confirm
      </button>
      <CloseIcon className="w-4 h-4" />
    </div>
  );
}

export default ScheduleCardCalendar;
