import Link from "next/link";
import { NotificationIcon } from "@/constants/icons";
import NotificationService from "@/services/NotificationService";
import { useStore } from "@/store";

function NotificationCard({ id, day, body, title, link, isRead, imgUrl }) {
  const { language } = useStore();

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
      className="flex p-2 w-full max-w-lg rounded-2xl border-b-2 border-blueBorderDark my-1 items-center"
    >
      <div
        className="flex-shrink-0 bg-blueBorder rounded-full mr-2 flex items-center justify-center"
        style={{ width: "40px", height: "40px", overflow: "hidden" }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="thumbnail"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <NotificationIcon color="#ffffff" size={20} />
        )}
      </div>

      <div className="flex-grow">
        <p
          className={` ${
            !isRead ? "text-textColor " : "text-textColorGraySoft"
          }`}
        >
          {title[language]}
        </p>
        <p
          className={` text-sm ${
            !isRead ? "text-textColor " : "text-textColorGraySoft"
          }`}
        >
          {body[language]}
        </p>
        <p
          className={`text-xs ${
            !isRead ? "text-textColor font-semibold" : "text-textColorGraySoft"
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
