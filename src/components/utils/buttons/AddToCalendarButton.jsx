import { useEffect, useState } from "react";

export default function AddToCalendarButton({ title, location, date }) {
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsApple(/iphone|ipad|macintosh/.test(ua));
  }, []);

  const eventDate = new Date(date);
  const dtStart = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const dtEnd = new Date(eventDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");

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
      const start = dtStart;
      const end = dtEnd;
      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        "Evento reservado vía SOS Travelers"
      )}&location=${encodeURIComponent(location)}`;
      window.open(calendarUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 border border-green-600 text-green-700 py-2 px-4 rounded-lg hover:bg-green-100 transition text-sm"
    >
      📅 Añadir al calendario
    </button>
  );
}
