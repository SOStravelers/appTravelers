import NotificationCard from "@/components/utils/cards/NotificationCard";
import { NotificationDraw } from "@/constants/icons";

export default function Notifications() {
  return (
    <div className="py-28 px-5 md:pl-80">
      <NotificationCard
        day="Today"
        text="You have a new booking"
        link="/worker/booking"
      />
      <p className="text-center max-w-lg mt-10">No more notifications</p>
      <div className="max-w-lg text-xl my-3 flex justify-center">
        <NotificationDraw />
      </div>
    </div>
  );
}
