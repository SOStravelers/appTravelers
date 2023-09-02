import { AlertIcon } from "@/constants/icons";
import Calendar from "@/components/utils/calendar/Calendar";

export default function Reservation() {
  return (
    <div className="flex flex-col items-center px-5">
      <div className="flex items-center my-5">
        <AlertIcon className="mr-1" />
        <h1 className="font-semibold">Select Reservation Date</h1>
      </div>
      <Calendar />
    </div>
  );
}
