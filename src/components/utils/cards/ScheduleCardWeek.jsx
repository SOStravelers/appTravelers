import { useState } from "react";
import OptionSwitch from "../switch/OptionSwitch";
import { CloseIcon } from "@/constants/icons";

function ScheduleCardWeek({ day, addInterval, deleteInterval, horario }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isOn, setIsOn] = useState(false);

  const openCard = () => setIsOpen(true);
  const closeCard = () => setIsOpen(false);

  const handleAddBreak = () => {
    addInterval(day.id, { startTime, endTime });
    setStartTime("08:00");
    setEndTime("10:00");
  };

  const handleDeleteBreak = () => {
    deleteInterval(day.id, { startTime, endTime });
    setStartTime("08:00");
    setEndTime("10:00");
  };

  return (
    <div className="border-blueBorder border-2 py-1 px-4 rounded-2xl flex flex-col items-center my-3">
      <div className="flex w-full justify-between items-center">
        <p>{day.name}</p>
        <OptionSwitch
          onFunction={openCard}
          offFunction={closeCard}
          isOn={isOn}
          setIsOn={setIsOn}
        />
      </div>
      {isOpen &&
        horario?.intervals?.map((interval, index) => (
          <div className="w-full flex flex-col items-center" key={index}>
            <div
              className="flex justify-between w-full items-center border border-blueBorder rounded-lg p-2"
              key={interval.day}
            >
              <div className="w-full flex flex-col">
                <label htmlFor="startTime" className="text-greyText text-sm">
                  From
                </label>
                <p>{interval.startTime}</p>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="endTime" className="text-greyText text-sm">
                  To
                </label>
                <p>{interval.endTime}</p>
              </div>
            </div>
            <button
              className="bg-blueBorder text-sm text-white rounded-full w-40 my-3"
              onClick={() => handleDeleteBreak()}
            >
              Delete Break
            </button>
          </div>
        ))}
      {isOpen && (
        <>
          <div className="flex justify-between w-full items-center border border-blueBorder rounded-lg p-2">
            <div className="w-full flex flex-col">
              <label htmlFor="startTime" className="text-greyText text-sm">
                From
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="endTime" className="text-greyText text-sm">
                To
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <button
            className="bg-blueBorder text-sm text-white rounded-full w-40 my-3"
            onClick={() => handleAddBreak()}
          >
            Add Break
          </button>
        </>
      )}
    </div>
  );
}

export default ScheduleCardWeek;
