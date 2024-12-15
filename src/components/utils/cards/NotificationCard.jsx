import Link from "next/link";
import { NotificationIcon, ClockIcon } from "@/constants/icons";
import NotificationService from "@/services/NotificationService";
function NotificationCard({ id, day, body, title, link, isRead }) {
  const setIsRead = async (id) => {
    try {
      const response = await NotificationService.setIsRead(id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Link
      onClick={() => setIsRead(id)}
      href={link}
      className="flex p-2 w-full max-w-lg rounded-2xl border-b-2 border-blueBorder my-1 items-center"
    >
      <div
        size={1}
        className="bg-blueBorder p-2 rounded-full mr-2 flex-shrink-0"
        style={{ width: "40px", height: "40px" }}
      >
        <NotificationIcon color="#ffffff" size={20} />
      </div>
      <div className="flex-grow">
        <p className={` ${!isRead ? "text-black " : "text-greyText"}`}>
          {title}
        </p>
        <p className="text-sm text-blackText">{body}</p>
        <p
          className={`text-xs ${
            !isRead ? "text-black font-semibold" : "text-greyText"
          }`}
        >
          {day}
        </p>
      </div>
      {!isRead && (
        <div
          style={{
            backgroundColor: "#00A0D5",
            height: "10px",
            width: "10px",
          }}
          className="rounded-full self-center flex-shrink-0"
        ></div>
      )}
    </Link>
  );
}

export default NotificationCard;
