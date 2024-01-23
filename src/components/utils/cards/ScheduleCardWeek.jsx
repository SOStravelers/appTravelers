import { useState, useEffect } from "react";
import OptionSwitch from "../switch/OptionSwitch";
import { CloseIcon } from "@/constants/icons";
import { ToastContainer, toast } from "react-toastify";
import { useStore } from "@/store";
import {
  addTime,
  esMenorQueLas22,
  compararHoras,
  horaEnRango,
} from "@/lib/time";

function ScheduleCardWeek({
  day,
  addInterval,
  deleteInterval,
  deleteOneBlock,
  enableDay,
  horario,
}) {
  const { isWorker } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isOn, setIsOn] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [longIntervals, setLongIntervals] = useState(false);

  const activeDay = () => {
    //Validador que ve si el cambio del array horario fue por la función addBlock() o saveChanges()
    if (!isEdit) {
      //Cambia botones y sólo deja visible boton Edit Block
      setIsSaved(true);
    }
    setIsEdit(false);
    if (horario && typeof horario === "object" && "isActive" in horario) {
      //Cambia valor del botón switch
      setIsOn(horario.isActive);
      if (horario.isActive) {
        //muestra o esconde componentes internos (misma condición que para el valor del switch)
        setIsOpen(true);
        let largo = horario.intervals.length;
        //Ve si el array tiene valores o no, en caso de tener utiliza ultimo objeto para setear valores de bloque de edición
        if (horario.intervals.length > 0) {
          setLongIntervals(true);
          let newTime = addTime(horario.intervals[largo - 1].endTime, 2);
          setStartTime(horario.intervals[largo - 1].endTime);
          setEndTime(newTime);
        } else {
          setLongIntervals(false);
        }
      }
    }
  };

  useEffect(() => {
    //Función que se activa cada vez que el objeto de horario es modificado
    activeDay();
  }, [horario]);

  const openCard = async () => {
    if (horario == []) {
      //setea para que aparezcan botones add block y saveChanges
      setIsSaved(false);
    }
    let largo = horario ? horario.intervals.length : 0;
    if (largo > 0) {
      let newTime = addTime(horario.intervals[largo - 1].endTime, 2);
      setStartTime(horario.intervals[largo - 1].endTime);
      setEndTime(newTime);
    }
    //Despliega componentes internos y muestra todos los horarios
    setIsOpen(true);
    //guarda el día como activo
    await enableDay(day, true);
  };

  const closeCard = () => {
    //guarda el día como desactivado en BD
    enableDay(day, false);
    //Esconde componentes de internos de todos los horarios
    setIsOpen(false);
  };

  const validador = async () => {
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
      toast.warn(
        isWorker
          ? "O horário de início deve ser posterior ao anterior."
          : "The start time must be later than the previous one.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        }
      );
    } else if (!hora1 || !hora2) {
      fail = true;
      toast.warn(
        isWorker
          ? "O horário varia apenas das 20h às 22h."
          : "Time ranges only from 8 to 10 PM.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        }
      );
    } else if (difHoras == 1) {
      fail = true;
      toast.warn(
        isWorker
          ? "O horário de término deve ser posterior ao horário de início."
          : "End time must be after start time.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        }
      );
    }
    return fail;
  };

  const addBlock = async () => {
    //validador de los diferentes formatos posibles de las horas a setear con respuesta de errores
    let fail = await validador();
    if (!fail) {
      //variable para que no se cambien los botones de add block y save changes a edit block (cuando se activa activeDay())
      setIsEdit(true);
      //añade intervalo al array de horario (dayID, isActive,interval,save) y no guarda en BD
      await addInterval(day.id, true, { startTime, endTime }, false);
      //setea horas de próximo bloque de edición utilizando el último bloque del array
      let newTime = addTime(endTime, 2);
      setStartTime(endTime);
      setEndTime(newTime);
    }
  };

  const saveChanges = async () => {
    //validador de los diferentes formatos posibles de las horas a setear con respuesta de errores
    let fail = await validador();
    if (!fail) {
      //añade intervalo al array de horario (dayID, isActive,interval,save) y guarda en BD
      await addInterval(day.id, true, { startTime, endTime }, true);
      //Cambia botones y sólo deja visible boton Edit Block
      setIsSaved(true);
      if (horario.intervals.length > 0) {
        setLongIntervals(true);
      } else {
        setLongIntervals(false);
      }
    }
  };

  const edit = async () => {
    const indexFinal = horario?.intervals.length - 1;
    //se setea en bloque de edición con los ultimos valores del array
    if (horario.intervals.length > 1) {
      let newTime = addTime(horario.intervals[indexFinal].endTime, 2);
      setStartTime(horario.intervals[indexFinal].endTime);
      setEndTime(newTime);
    } else if (horario.intervals.length == 1) {
      setStartTime(horario.intervals[indexFinal].startTime);
      setEndTime(horario.intervals[indexFinal].endTime);
    }
    //Elimina ultimo objeto del array del horario, para usar ese valor como edición. No guarda en BD
    await deleteInterval(day.id, indexFinal);
    //Cambia botones de Edit block a Add Block con Save changes
    setIsSaved(false);
  };
  const deleteBlock = async (index) => {
    deleteOneBlock(day.id, index);
  };
  const mergeBlock = (index) => {
    const indexFinal = horario?.intervals.length;
    const start = horario?.intervals[indexFinal - 1].startTime;
    deleteInterval(day.id, index);
    if (index == horario?.intervals.length) {
      setStartTime(start);
      // setEndTime(end);
    }
  };
  //funcion para convertir nombre del dia de la semana al portugues:
  function convertDay(day) {
    console.log(day);
    switch (day) {
      case "Monday":
        return "Segunda";
      case "Tuesday":
        return "Terça";
      case "Wednesday":
        return "Quarta";
      case "Thursday":
        return "Quinta";
      case "Friday":
        return "Sexta";
      case "Saturday":
        return "Sábado";
      case "Sunday":
        return "Domingo";
      default:
        return "Dia";
    }
  }

  return (
    <div className="border-blueBorder border-2 py-1 px-4 rounded-2xl flex flex-col items-center my-3">
      <div className="flex w-full justify-between items-center">
        <p>{convertDay(day.name)}</p>
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
              <div className="w-full flex flex-col w-1/2 ml-5">
                <label htmlFor="startTime" className="text-greyText text-sm">
                  {isWorker ? "Desde" : "From"}
                </label>
                <p>{interval.startTime}</p>
              </div>
              <div className="w-full flex flex-col w-1/2">
                <label htmlFor="endTime" className="text-greyText text-sm">
                  {isWorker ? "Até" : "To"}
                </label>
                <p>{interval.endTime}</p>
              </div>
              {((isOpen && !saved) || (isOpen && !longIntervals)) && (
                <div className=" flex flex-col w-1/8 ">
                  <button
                    onClick={() => deleteBlock(index)}
                    style={{ marginLeft: "-30px" }}
                  >
                    <span>X</span>
                  </button>
                </div>
              )}
            </div>
            {((isOpen && !saved) || (isOpen && !longIntervals)) && (
              <button
                className="bg-blueBorder text-sm text-white rounded-full w-40 mt-3"
                onClick={() => mergeBlock(index)}
              >
                {isWorker ? "Juntar bloco" : "Merge Block"}
              </button>
            )}
          </div>
        ))}
      {((isOpen && !saved) || (isOpen && !longIntervals)) && (
        <>
          <div className="flex justify-between w-full items-center border border-blueBorder rounded-lg p-2 mb-4">
            <div className="w-full flex flex-col w-1/2 ml-5">
              <label htmlFor="startTime" className="text-greyText text-sm">
                {isWorker ? "Até" : "To"}
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
            <div className="w-full flex flex-col w-1/2" sty>
              <label htmlFor="endTime" className="text-greyText text-sm">
                {isWorker ? "Até" : "To"}
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
                onClick={() => addBlock()}
              >
                {isWorker ? "Adicionar bloco" : "Add Block"}
              </button>
            )}
            <button
              className="bg-blueBorder text-sm text-white rounded-full w-40 my-3 mx-2"
              onClick={() => saveChanges()}
            >
              {isWorker ? "Salvar alterações" : "Save changes"}
            </button>
          </div>
        </>
      )}
      {isOpen && saved && longIntervals && (
        <button
          className="bg-blueBorder text-sm text-white rounded-full w-40 my-3 mx-2"
          onClick={() => edit()}
        >
          {isWorker ? "Editar bloco" : "Edit Block"}
        </button>
      )}
    </div>
  );
}

export default ScheduleCardWeek;
