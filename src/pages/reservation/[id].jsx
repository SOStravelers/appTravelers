import { useRouter } from "next/router";

import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";

export default function Reservation() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center px-3 pb-20">
      <div className="flex items-center my-5">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">Select Reservation Date</h1>
      </div>
      <Calendar id={router?.query?.id} />
    </div>
  );
}
