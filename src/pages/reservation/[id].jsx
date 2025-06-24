import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "@/store";
import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";
import languageData from "@/language/reservation.json";
export default function Reservation({ asModal = false, id, onClose }) {
  const { language } = useStore();
  const router = useRouter();
  useEffect(() => {
    console.log("la id", router?.query?.id);
    if (!asModal) {
      document.title = "Reservation | SOS Travelers";
    }
  }, [asModal]);

  return (
    <div className="flex flex-col items-center md:items-start py-5 px-4">
      <div className="flex items-center  mb-2">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">{languageData.selectDate[language]}</h1>
      </div>
      <Calendar id={router?.query?.id} />
    </div>
  );
}
