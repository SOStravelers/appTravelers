import { useRouter } from "next/router";
import { useEffect } from "react";

import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";

export default function Reservation() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Reservation | SOS Travelers";
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start py-20 lg:pb-50 pt-14 xl:py-24 px-5 md:pl-80 ">
      <div className="flex items-center mt-5 mb-2">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">Select Reservation Date</h1>
      </div>
      <Calendar id={router?.query?.id} />
    </div>
  );
}
