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
  let newStatus = status;
  switch (status) {
    case "requested":
      color = "grey";
      statusPortugues = "Solicitado";
      break;
    case "available":
      if (isWorker) {
        color = "grey";
        statusPortugues = "Dispónivel";
      } else {
        color = "grey";
        newStatus = "Requested";
      }
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

  return <span style={style}>{isWorker ? statusPortugues : newStatus}</span>;
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

export const formatearFecha = (fechaStr, idioma) => {
  const [año, mes, dia] = fechaStr.split("-").map(Number);

  // Crear un nuevo objeto Date en el huso horario local
  const fechaObj = new Date(año, mes - 1, dia);

  // Meses y días de la semana en cada idioma
  const meses = {
    en: [
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
    ],
    es: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    fr: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    de: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    pt: [
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
    ],
  };

  const diasSemana = {
    en: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    es: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    fr: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    de: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    pt: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ],
  };

  // Formatos de fecha según idioma
  const formatos = {
    en: (d, m, y, dw) => `${dw}, ${m} ${d}, ${y}`,
    es: (d, m, y, dw) => `${dw}, ${d} de ${m} de ${y}`,
    fr: (d, m, y, dw) => `${dw} ${d} ${m} ${y}`,
    de: (d, m, y, dw) => `${dw}, ${d}. ${m} ${y}`,
    pt: (d, m, y, dw) => `${dw}, ${d} de ${m} de ${y}`,
  };

  // Obtener mes, día, año y día de la semana
  const mesTexto = meses[idioma][fechaObj.getMonth()];
  const diaTexto = diasSemana[idioma][fechaObj.getDay()];

  // Usar el formato correcto
  const formatear = formatos[idioma];
  const fechaFormateada = formatear(dia, mesTexto, año, diaTexto);

  return fechaFormateada;
};
