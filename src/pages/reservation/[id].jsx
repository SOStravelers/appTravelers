import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "@/store";
import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";
import languageData from "@/language/reservation.json";
export default function Reservation() {
  const router = useRouter();
  const { language } = useStore();
  useEffect(() => {
    document.title = "Reservation | SOS Travelers";
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start py-20 pt-14 px-5 md:pl-80 md:pt-20">
      <div className="flex items-center mt-5 mb-2">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">{languageData.selectDate[language]}</h1>
      </div>
      <Calendar id={router?.query?.id} />
    </div>
  );
}
