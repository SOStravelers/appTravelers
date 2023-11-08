import { useState } from "react";
import OptionSwitch from "../switch/OptionSwitch";
import { CloseIcon } from "@/constants/icons";

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

  const handleAddBreak = async () => {
    await addInterval(day.id, { startTime, endTime });
    console.log("new");
    let newTime = addTime(endTime, 2);
    setStartTime(endTime);
    setEndTime(newTime);
  };
  const saveChanges = async () => {
    setIsSaved(true);

    await addInterval(day.id, { startTime, endTime });
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

  const addTime = (horaInicial, horasASumar) => {
    // Parsea la hora inicial en "hh:mm" a horas y minutos
    const partesHora = horaInicial.split(":");
    const hora = parseInt(partesHora[0], 10);
    const minutos = parseInt(partesHora[1], 10);

    // Suma las horas y los minutos
    const nuevaHora = new Date();
    nuevaHora.setHours(hora + horasASumar, minutos);

    // Formatea la nueva hora en formato "hh:mm" (24 horas)
    const horaFormateada = `${nuevaHora.getHours()}:${nuevaHora
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return horaFormateada;
  };

  function esMenorQueLas22(hora) {
    // Parsea la hora en "hh:mm" a horas y minutos
    const partesHora = hora.split(":");
    const horas = parseInt(partesHora[0], 10); // Cambio de nombre a "horas"
    const minutos = parseInt(partesHora[1], 10);

    // Crea un objeto Date para la hora límite (22:00)
    const horaLimite = new Date();
    horaLimite.setHours(22, 0);

    // Crea un objeto Date para la hora proporcionada
    const horaProporcionada = new Date();
    horaProporcionada.setHours(horas, minutos); // Uso "horas" en lugar de "hora"

    // Compara la hora proporcionada con la hora límite
    return horaProporcionada < horaLimite;
  }

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
