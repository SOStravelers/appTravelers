import NotificationCard from "@/components/utils/cards/NotificationCard";
import { NotificationDraw } from "@/constants/icons";
import { useEffect, useState, useRef } from "react";
import NotificationService from "@/services/NotificationService";
import { Rings, Oval } from "react-loader-spinner";
import { formatDistanceToNow } from "date-fns";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
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
      const limit = 20;
      const response = await NotificationService.getAll(page, limit);
      console.log("data", response.data.docs);
      setNotifications(response.data.docs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
            link={
              notification.booking
                ? `/service-details/${notification.booking._id}`
                : "/notifications"
            }
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

      <div className="loading" ref={loader}>
        {/* <h4>load more</h4> */}
        {/* {loading2 && (
          <div className="max-w-lg flex flex-col items-center justify-center">
            <Oval
              width={10}
              height={10}
              color="#00A0D5"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
