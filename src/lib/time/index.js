export const addTime = (horaInicial, horasASumar) => {
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
export const esMenorQueLas22 = (hora) => {
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
};
export const compararHoras = (hora1, hora2) => {
  // Parsea las horas en "hh:mm" a objetos Date
  const dateHora1 = new Date(0, 0, 0, hora1.split(":")[0], hora1.split(":")[1]);
  const dateHora2 = new Date(0, 0, 0, hora2.split(":")[0], hora2.split(":")[1]);

  // Compara las dos horas
  if (dateHora1 < dateHora2) {
    return -1; // hora1 es menor que hora2
  } else if (dateHora1 > dateHora2) {
    return 1; // hora1 es mayor que hora2
  } else {
    return 0; // hora1 es igual a hora2
  }
};
export const horaEnRango = (hora) => {
  // Parsea la hora en formato "HH:mm"
  const parts = hora.split(":");
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);

  // Verifica si la hora está en el rango de 08:00 a 22:00
  if (hour >= 8 && hour <= 22) {
    return true;
  } else if (hour === 22 && minute === 0) {
    // Considera 22:00 como dentro del rango
    return true;
  } else {
    return false;
  }
};

//convierte minutos a horas
export const formatTime = (duration) => {
  return duration > 120
    ? `${(duration / 60).toFixed(1)} hr${duration >= 180 ? "s" : ""}`
    : `${duration} min`;
};

// nuevas

const languageToLocale = {
  es: "es-ES",
  en: "en-US",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
};

export const getUserTimeData = (language) => {
  try {
    const locale = languageToLocale[language] || "en-US";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();

    return {
      timeZone,
      language, // original (es, pt, etc.)
      locale, // ej: "es-ES"
      isoTime: now.toISOString(),
    };
  } catch (error) {
    console.error("Error obteniendo zona horaria:", error);
    return {
      timeZone: "UTC",
      language: "en",
      locale: "en-US",
      isoTime: new Date().toISOString(),
    };
  }
};
