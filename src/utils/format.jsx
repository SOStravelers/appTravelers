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

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

// Extensiones necesarias
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Idiomas
import "dayjs/locale/es";
import "dayjs/locale/pt";
import "dayjs/locale/fr";
import "dayjs/locale/de";
import "dayjs/locale/en"; // importante para compatibilidad

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

//NUEVAS

export const zonas = {
  br: "America/Sao_Paulo",
  cl: "America/Santiago",
  us: "America/New_York",
  es: "Europe/Madrid",
  de: "Europe/Berlin",
  fr: "Europe/Paris",
  ar: "America/Argentina/Buenos_Aires",
  mx: "America/Mexico_City",
};

export const locales = {
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  en: "en-US",
};

export const diasSemana = {
  es: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ],
  pt: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  de: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

export const meses = {
  es: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  pt: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  fr: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
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
};

const nombresPaises = {
  br: "Brasil",
  cl: "Chile",
  us: "Estados Unidos",
  es: "España",
  de: "Alemania",
  fr: "Francia",
  ar: "Argentina",
  mx: "México",
};

const formatos = {
  en: (d, m, y, dw, pais) => `${dw}, ${m} ${d}, ${y} (local time in ${pais})`,
  es: (d, m, y, dw, pais) => `${dw}, ${d} de ${m} de ${y} (hora de ${pais})`,
  fr: (d, m, y, dw, pais) => `${dw} ${d} ${m} ${y} (heure locale ${pais})`,
  de: (d, m, y, dw, pais) => `${dw}, ${d}. ${m} ${y} (Ortszeit in ${pais})`,
  pt: (d, m, y, dw, pais) => `${dw}, ${d} de ${m} de ${y} (hora de ${pais})`,
};

export const formatearFechaCompletaDesdeISO = (
  isoString,
  idioma = "pt",
  pais = "br"
) => {
  const fechaUTC = new Date(isoString);
  if (isNaN(fechaUTC.getTime())) {
    return {
      formatedDate: "",
      formatedTime: "",
    };
  }

  const timeZone = zonas[pais] || zonas.br;
  const paisTexto = nombresPaises[pais] || "Brasil";

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

  const dia = fechaLocal.getDate();
  const mesTexto = meses[idioma]?.[fechaLocal.getMonth()] || "";
  const año = fechaLocal.getFullYear();
  const diaSemanaTexto = diasSemana[idioma]?.[fechaLocal.getDay()] || "";

  const formatedDate =
    formatos[idioma]?.(dia, mesTexto, año, diaSemanaTexto, paisTexto) || "";

  const formatedTime = fechaLocal.toLocaleTimeString(
    locales[idioma] || "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }
  );

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
export const formatearFechaCortaDesdeISO = (
  isoString,
  idioma = "pt",
  pais = "br"
) => {
  const fechaUTC = new Date(isoString);
  if (isNaN(fechaUTC.getTime())) {
    return {
      formatedDate: "",
      formatedTime: "",
      formatedDateShort: "",
    };
  }

  const timeZone = zonas[pais] || zonas.br;
  const paisTexto = nombresPaises[pais] || "Brasil";
  const locale = locales[idioma] || "pt-BR";

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

  const dia = fechaLocal.getDate();
  const mesTexto = meses[idioma]?.[fechaLocal.getMonth()] ?? "";
  const año = fechaLocal.getFullYear();
  const diaSemanaTexto = diasSemana[idioma]?.[fechaLocal.getDay()] ?? "";

  const formatedDate =
    formatos[idioma]?.(dia, mesTexto, año, diaSemanaTexto, paisTexto) || "";

  const formatedTime = fechaLocal.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });

  const formatedDateShort = fechaLocal.toLocaleDateString(locale, {
    timeZone,
  });

  return {
    formatedDate,
    formatedTime,
    formatedDateShort,
  };
};

export const formatearFechaCortaInteligente = (
  isoString,
  idioma = "pt",
  pais = "br"
) => {
  const fechaUTC = new Date(isoString);
  if (isNaN(fechaUTC.getTime())) {
    return { fechaInteligente: "" };
  }

  const timeZone = zonas[pais] || zonas.br;
  const locale = locales[idioma] || "pt-BR";

  // Obtener partes locales (en UTC para extraer partes seguras)
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

  const ahora = new Date();
  const ahoraPartes = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(ahora);

  const hoyValores = {};
  for (const p of ahoraPartes) {
    if (p.type !== "literal") hoyValores[p.type] = parseInt(p.value, 10);
  }

  const esFuturo = fechaLocal.getTime() > ahora.getTime();
  const esMismoMes =
    valores.year === hoyValores.year && valores.month === hoyValores.month;
  const esMismoAño = valores.year === hoyValores.year;

  const dia = fechaLocal.getDate();
  const mesTexto = meses[idioma]?.[fechaLocal.getMonth()] ?? "";
  const diaSemanaTexto = diasSemana[idioma]?.[fechaLocal.getDay()] ?? "";

  if (esFuturo && esMismoMes) {
    return { fechaInteligente: `${diaSemanaTexto} ${dia}` };
  }

  if (esFuturo && esMismoAño) {
    return { fechaInteligente: `${dia} de ${mesTexto}` };
  }

  const formatoCorto = fechaLocal.toLocaleDateString(locale, {
    timeZone,
  });

  return { fechaInteligente: formatoCorto };
};
