import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  isWithinInterval,
  addDays,
} from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { ptBR, enUS, de, fr, es } from "date-fns/locale";
import LanguageData from "@/language/booking.json";
export const fullName = (data) => {
  if (!data) return "";
  const { first, last } = data;
  return first + " " + (last ?? "");
};

export const StatusChip = ({ status, isWorker, language }) => {
  let color;
  let textColor = "white"; // Define textColor here
  switch (status) {
    case "requested":
      color = "grey";
      break;
    case "available":
      if (!isWorker) {
        color = "grey";
        status = "requested";
      }
      break;
    case "completed":
      color = "green";
      break;
    case "canceled":
      color = "#e77b7b";
      break;
    case "confirmed":
      color = "#92ef72";
      textColor = "black";
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
  return (
    <span style={style}>{LanguageData.status[status][language] || ""}</span>
  );
};

export const getDayOfWeek = (date, language) => {
  const locales = {
    en: enUS,
    pt: ptBR,
    es: es,
    fr: fr,
    de: de,
  };
  const timeZone = "America/Sao_Paulo";
  const zonedDate = utcToZonedTime(date, timeZone);
  const locale = locales[language];
  const today = LanguageData.workCard.today[language];
  const yesterday = LanguageData.workCard.yesterday[language];
  const tomorrow = LanguageData.workCard.tomorrow[language];

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

export const getServiceNames = (data, language) => {
  // Extraer los nombres de los servicios
  console.log("wenos wenos", data.services, language);
  if (!data) return;
  const serviceNames = data.services.map(
    (service) => service.id.name[language]
  );

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

//NUEVAS

export const formatearFechaCompletaDesdeISO = (
  isoString,
  idioma = "pt",
  pais = "br"
) => {
  console.log("data", isoString, idioma, pais);
  const fechaUTC = new Date(isoString);

  if (isNaN(fechaUTC.getTime())) {
    return {
      formatedDate: "",
      formatedTime: "",
    };
  }

  // Mapear país a timezone e identificación para texto
  const paises = {
    br: { timeZone: "America/Sao_Paulo", texto: "Brasil" },
    cl: { timeZone: "America/Santiago", texto: "Chile" },
    us: { timeZone: "America/New_York", texto: "Estados Unidos" },
    es: { timeZone: "Europe/Madrid", texto: "España" },
    de: { timeZone: "Europe/Berlin", texto: "Alemania" },
    fr: { timeZone: "Europe/Paris", texto: "Francia" },
    ar: { timeZone: "America/Argentina/Buenos_Aires", texto: "Argentina" },
    mx: { timeZone: "America/Mexico_City", texto: "México" },
  };

  const configPais = paises[pais] || paises.br;
  const timeZone = configPais.timeZone;
  const paisTexto = configPais.texto;

  // Obtener partes de fecha local correctamente desde UTC
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(fechaUTC);

  const valores = {};
  for (const p of partes) {
    if (p.type !== "literal") valores[p.type] = parseInt(p.value, 10);
  }

  const fechaLocal = new Date(
    valores.year,
    valores.month - 1,
    valores.day,
    valores.hour,
    valores.minute,
    valores.second
  );

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

  const formatos = {
    en: (d, m, y, dw, pais) => `${dw}, ${m} ${d}, ${y} (local time in ${pais})`,
    es: (d, m, y, dw, pais) => `${dw}, ${d} de ${m} de ${y} (hora de ${pais})`,
    fr: (d, m, y, dw, pais) => `${dw} ${d} ${m} ${y} (heure locale ${pais})`,
    de: (d, m, y, dw, pais) => `${dw}, ${d}. ${m} ${y} (Ortszeit in ${pais})`,
    pt: (d, m, y, dw, pais) => `${dw}, ${d} de ${m} de ${y} (hora de ${pais})`,
  };

  const dia = fechaLocal.getDate();
  const mesTexto = meses[idioma][fechaLocal.getMonth()];
  const año = fechaLocal.getFullYear();
  const diaSemanaTexto = diasSemana[idioma][fechaLocal.getDay()];
  const formatedDate = formatos[idioma](
    dia,
    mesTexto,
    año,
    diaSemanaTexto,
    paisTexto
  );

  const locales = {
    es: "es-CL",
    en: "en-US",
    pt: "pt-BR",
    fr: "fr-FR",
    de: "de-DE",
  };

  const formatedTime = fechaLocal.toLocaleTimeString(locales[idioma], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });

  return {
    formatedDate,
    formatedTime,
  };
};

export const sumarMinutosAISO = (isoString, minutos = 0) => {
  const fecha = new Date(isoString);

  if (isNaN(fecha.getTime())) {
    console.error("❌ Fecha inválida:", isoString);
    return null;
  }

  // Sumar los minutos en milisegundos
  const nuevaFecha = new Date(fecha.getTime() + minutos * 60 * 1000);

  return nuevaFecha.toISOString();
};

export const formatPrice = (price, currency) => {
  typeof price !== "number" && (price = "-");

  if (currency == "eur") {
    return price + " € EUR";
  } else if (currency == "usd") {
    return price + " USD";
  } else {
    return "R$ " + price;
  }
};

export function isBeforeHoursThreshold(
  dateString,
  hoursBefore,
  language = "pt"
) {
  const targetDate = new Date(dateString);

  if (isNaN(targetDate.getTime())) {
    console.error("❌ Fecha inválida:", dateString);
    return {
      isBefore: false,
      cancelTime: {
        isoTime: null,
        stringData: "",
      },
    };
  }

  // Calcular la fecha límite
  const thresholdDate = new Date(
    targetDate.getTime() - hoursBefore * 60 * 60 * 1000
  );

  const now = new Date(); // ya es en UTC

  return {
    isBefore: now < thresholdDate,
    cancelTime: formatearFechaCompletaDesdeISO(
      thresholdDate.toISOString(),
      language
    ),
  };
}
