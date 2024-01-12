import NotificationCard from "@/components/utils/cards/NotificationCard";
import { NotificationDraw } from "@/constants/icons";
import { useEffect, useState } from "react";
import NotificationService from "@/services/NotificationService";
import { Rings } from "react-loader-spinner";
import { formatDistanceToNow } from "date-fns";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = "Notifications | SOS Travelers";
    getData();
  }, []);
  const formattedDate = (date) => {
    const newDate = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      includeSeconds: true,
    }).replace(/about\s/, "");
    return newDate;
  };
  //funcion para obtener las notificaciones del usuario
  const getData = async () => {
    try {
      const response = await NotificationService.getAll();
      setNotifications(response.data.docs);
      setLoading(false);
      console.log(response.data.docs);
    } catch (error) {
      setLoading(false);
    }
  };
  const setIsRead = async (id) => {
    try {
      const response = await NotificationService.setIsRead(id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="py-20 px-5 md:pl-80">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      ) : (
        notifications.map((notification, index) => (
          <NotificationCard
            id={notification._id}
            day={formattedDate(notification.createdAt)}
            key={index}
            isRead={notification.isRead}
            title={notification.title}
            body={notification.body}
            link={notification.link}
          />
        ))
      )}
      {!loading && notifications.length === 0 && (
        <>
          <p className="text-center max-w-lg mt-10">No more notifications</p>
          <div className="max-w-lg text-xl my-3 flex justify-center">
            <NotificationDraw />
          </div>
        </>
      )}
    </div>
  );
}
