import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  isWithinInterval,
  addDays,
} from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { ptBR, enUS } from "date-fns/locale";

export const fullName = (data) => {
  if (!data) return "";
  const { first, last } = data;
  return first + " " + (last ?? "");
};

export const StatusChip = ({ status, isWorker }) => {
  let color;
  let textColor = "white"; // Define textColor here
  let statusPortugues = status;
  switch (status) {
    case "requested":
      color = "grey";
      statusPortugues = "Solicitado";
      break;
    case "completed":
      color = "green";
      statusPortugues = "Completado";
      break;
    case "canceled":
      color = "#e77b7b";
      statusPortugues = "Cancelado";
      break;
    case "confirmed":
      color = "#92ef72";
      textColor = "black";
      statusPortugues = "Confirmado";
      break;
    default:
      color = "gray";
  }

  const style = {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    position: "relative",
    transform: "translateY(-2px)",
    borderRadius: "9999px",
    height: "30px",
    fontSize: "0.85rem",
    fontWeight: "550",
    color: textColor,
    backgroundColor: color,
  };

  return <span style={style}>{isWorker ? statusPortugues : status}</span>;
};

export const getDayOfWeek = (date, isWorker) => {
  const timeZone = "America/Sao_Paulo";
  const zonedDate = utcToZonedTime(date, timeZone);
  const locale = isWorker ? ptBR : enUS;
  const today = isWorker ? "hoje" : "today";
  const yesterday = isWorker ? "ontem" : "yesterday";
  const tomorrow = isWorker ? "amanhã" : "tomorrow";

  if (isToday(zonedDate)) {
    return today;
  } else if (isYesterday(zonedDate)) {
    return yesterday;
  } else if (isTomorrow(zonedDate)) {
    return tomorrow;
  } else if (
    isWithinInterval(zonedDate, {
      start: zonedTimeToUtc(new Date(), timeZone),
      end: addDays(zonedTimeToUtc(new Date(), timeZone), 7),
    })
  ) {
    return format(zonedDate, "EEEE", { locale: locale });
  } else {
    return date;
  }
};

export const getServiceNames = (data) => {
  // Extraer los nombres de los servicios
  if (!data) return;
  const serviceNames = data.services.map((service) => service.id.name);

  // Unir los nombres en un solo string con comas
  const serviceNamesString = serviceNames.join(", ");
  return serviceNamesString;
};

export const formatearFecha = (fechaStr, isWorker) => {
  var [año, mes, dia] = fechaStr.split("-").map(Number);

  // Crear un nuevo objeto Date en el huso horario local
  var fechaObj = new Date(año, mes - 1, dia);

  // Meses y días de la semana en inglés
  var mesesIngles = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var diasSemanaIngles = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Meses y días de la semana en portugués
  var mesesPortugues = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  var diasSemanaPortugues = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  // Seleccionar los meses y días de la semana correctos
  var meses = isWorker ? mesesPortugues : mesesIngles;
  var diasSemana = isWorker ? diasSemanaPortugues : diasSemanaIngles;

  // Obtener el mes, día y año
  var mes = meses[fechaObj.getMonth()];
  var dia = fechaObj.getDate();
  var año = fechaObj.getFullYear();
  var diaSemana = diasSemana[fechaObj.getUTCDay()];

  // Formatear la fecha como "Wednesday, December 20, 2023" o "Quarta-feira, Dezembro 20, 2023"
  var fechaFormateada = diaSemana + ", " + mes + " " + dia + ", " + año;

  return fechaFormateada;
};
