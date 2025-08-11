import CalendarBooking from "../utils/calendar/CalendarBooking";
import LanguageData from "@/language/booking.json";
import { useStore } from "@/store";
function MonthSection() {
  const store = useStore();
  const { language } = store;
  return (
    <div className="my-5 mb-32">
      <h1 className="text-center text-textColor text-xl my-4 max-w-lg ">
        {LanguageData.section3.title[language]}
      </h1>
      <div className="w-full max-w-lg">
        <CalendarBooking />
      </div>
    </div>
  );
}

export default MonthSection;
