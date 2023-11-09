import { useState } from "react";
import OptionSwitch from "../switch/OptionSwitch";
import { CloseIcon } from "@/constants/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  addTime,
  esMenorQueLas22,
  compararHoras,
  horaEnRango,
} from "@/lib/time";

function ScheduleCardWeek({ day, addInterval, deleteInterval, horario }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isOn, setIsOn] = useState(false);
  const openCard = () => {
    setIsOpen(true);
  };
  const closeCard = () => setIsOpen(false);

  const validador = async () => {
    console.log("validador");
    var fail = false;
    let hora1 = horaEnRango(startTime);
    let hora2 = horaEnRango(endTime);
    let difHoras = compararHoras(startTime, endTime);
    let index = horario?.intervals.length;
    let compararAnterior = -1;
    if (index > 0) {
      var anterior = horario?.intervals[index - 1].endTime;
      compararAnterior = compararHoras(anterior, startTime);
    }
    if (compararAnterior == 1) {
      fail = true;
      toast.warn("Las inicial debe ser mayor que la anterior", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    } else if (!hora1 || !hora2) {
      fail = true;
      toast.warn("Las horas deben estar entre 8 AM y 10 PM", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    } else if (difHoras == 1) {
      fail = true;
      toast.warn("Hora final debe ser mayor a inicial", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    }
    return fail;
  };

  const handleAddBreak = async () => {
    let fail = await validador();
    console.log("fail", fail);
    if (!fail) {
      await addInterval(day.id, { startTime, endTime });
      let newTime = addTime(endTime, 2);
      setStartTime(endTime);
      setEndTime(newTime);
    }
  };
  const saveChanges = async () => {
    let fail = await validador();
    console.log("fail", fail);
    if (!fail) {
      setIsSaved(true);
      toast.info("Horario guardado", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1200,
      });
      await addInterval(day.id, { startTime, endTime });
    }
  };
  const edit = async () => {
    setIsSaved(false);
    const indexFinal = horario?.intervals.length - 1;
    await deleteInterval(day.id, indexFinal);
  };
  const handleDeleteBreak = (index) => {
    console.log("delete", index, horario?.intervals[index]);
    const indexFinal = horario?.intervals.length;
    const start = horario?.intervals[indexFinal - 1].startTime;
    deleteInterval(day.id, index);
    if (index == horario?.intervals.length) {
      setStartTime(start);
    }
    // setEndTime(end);
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
          <div className="w-full flex flex-col items-center my-2" key={index}>
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
            {!saved && (
              <button
                className="bg-blueBorder text-sm text-white rounded-full w-40 my-3"
                onClick={() => handleDeleteBreak(index)}
              >
                Delete Break
              </button>
            )}
          </div>
        ))}
      {isOpen && !saved && (
        <>
          <div className="flex justify-between w-full items-center border border-blueBorder rounded-lg p-2 mb-4">
            <div className="w-full flex flex-col">
              <label htmlFor="startTime" className="text-greyText text-sm">
                From
              </label>
              <input
                type="time"
                min="08:00"
                max="22:00"
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
                min="08:00"
                max="22:00"
                required
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <div className="button-container" style={{ textAlign: "center" }}>
            {esMenorQueLas22(endTime) && (
              <button
                className="bg-blueBorder text-sm text-white rounded-full w-40 my-3 mx-2"
                onClick={() => handleAddBreak()}
              >
                Add Breaks
              </button>
            )}
            <button
              className="bg-blueBorder text-sm text-white rounded-full w-40 my-3 mx-2"
              onClick={() => saveChanges()}
            >
              Guardar Cambios
            </button>
          </div>
        </>
      )}
      {isOpen && saved && (
        <button
          className="bg-blueBorder text-sm text-white rounded-full w-40 my-3 mx-2"
          onClick={() => edit()}
        >
          Editar
        </button>
      )}
    </div>
  );
}

export default ScheduleCardWeek;
