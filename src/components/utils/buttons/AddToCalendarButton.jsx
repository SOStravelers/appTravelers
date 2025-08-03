import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { FaRegCalendarPlus } from "react-icons/fa";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

const timeZones = {
  br: "America/Sao_Paulo",
  cl: "America/Santiago",
  us: "America/New_York",
  es: "Europe/Madrid",
  de: "Europe/Berlin",
  fr: "Europe/Paris",
};

const countryLabels = {
  br: "hora de Brasil",
  cl: "hora de Chile",
  us: "hora de EE.UU.",
  es: "hora de España",
  de: "hora de Alemania",
  fr: "hora de Francia",
};

export default function AddToCalendarButton({
  title,
  location,
  date,
  duration = 60,
  country = "br",
}) {
  const [isApple, setIsApple] = useState(false);
  const [localTimeText, setLocalTimeText] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsApple(/iphone|ipad|macintosh/.test(ua));
  }, []);

  useEffect(() => {
    const zone = timeZones[country] || "UTC";
    const start = DateTime.fromISO(date, { zone });
    const end = start.plus({ minutes: duration });
    const label = countryLabels[country] || "hora local";

    const formatted = `🕒 ${start.toFormat("HH:mm")} – ${end.toFormat(
      "HH:mm"
    )} (${label})`;
    setLocalTimeText(formatted);
  }, [date, duration, country]);

  const dtStart = DateTime.fromISO(date)
    .toUTC()
    .toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtEnd = DateTime.fromISO(date)
    .toUTC()
    .plus({ minutes: duration })
    .toFormat("yyyyMMdd'T'HHmmss'Z'");

  const handleClick = () => {
    if (isApple) {
      const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${dtStart}
DTEND:${dtEnd}
LOCATION:${location}
DESCRIPTION:Evento reservado vía SOS Travelers
END:VEVENT
END:VCALENDAR
      `.trim();

      const blob = new Blob([icsContent], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.ics`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${dtStart}/${dtEnd}&details=${encodeURIComponent(
        "Evento reservado vía SOS Travelers"
      )}&location=${encodeURIComponent(location)}`;
      window.open(calendarUrl, "_blank");
    }
  };

  return (
    <div className="text-center">
      <OutlinedButton
        onClick={handleClick}
        text="Añadir al calendario"
        py={3}
        margin="my-5"
        icon={FaRegCalendarPlus}
        dark="darkLight"
        textSize="text-md"
        textColor="text-white"
        buttonCenter={true}
        minWidth="260px"
      />
    </div>
  );
}
