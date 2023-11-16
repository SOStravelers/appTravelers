import { useRouter } from "next/router";

import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";

export default function Reservation() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Reservation - SOS Travelers";
    getData();
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start py-28 px-5 md:pl-80">
      <div className="flex items-center my-5">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">Select Reservation Date</h1>
      </div>
      <Calendar id={router?.query?.id} />
    </div>
  );
}
