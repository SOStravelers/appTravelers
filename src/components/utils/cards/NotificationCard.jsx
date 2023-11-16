import Link from "next/link";
import { NotificationIcon, ClockIcon } from "@/constants/icons";

function NotificationCard({ day, text, link }) {
  return (
    <Link
      href={link}
      className="flex p-4 w-full max-w-lg rounded-2xl border-b-2 border-blueBorder my-2 items-center"
    >
      <div className="bg-blueBorder p-2 rounded-full mr-2">
        <NotificationIcon color={"#ffffff"} />
      </div>
      <div>
        <p className="text-blackText">{text}</p>
        <p className="text-greyText">{day}</p>
      </div>
    </Link>
  );
}

export default NotificationCard;
