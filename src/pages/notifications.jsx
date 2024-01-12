import NotificationCard from "@/components/utils/cards/NotificationCard";
import { NotificationDraw } from "@/constants/icons";
import { useEffect, useState, useRef } from "react";
import NotificationService from "@/services/NotificationService";
import { Rings, Oval } from "react-loader-spinner";
import { formatDistanceToNow } from "date-fns";
import { set } from "zod";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [more, setMore] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  useEffect(() => {
    document.title = "Notifications | SOS Travelers";
    getData();
  }, []);
  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
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
      console.log("getData");
      const limit = 5;
      const response = await NotificationService.getAll(page, limit);
      setNotifications(response.data.docs);
      setLoading(false);
      setMore(true);
      console.log(response.data.docs);
    } catch (error) {
      setLoading(false);
    }
  };
  const getMoreData = async () => {
    try {
      console.log("getMoreData");
      setLoading2(true);
      const limit = 5;
      const response = await NotificationService.getAll(page, limit);
      const newData = notifications.concat(response.data.docs);
      setNotifications(newData);
      setLoading2(false);
      console.log(response.data.docs);
    } catch (error) {
      setLoading2(false);
    }
  };
  useEffect(() => {
    console.log("efect more", more, page);
    // if (more) {
    getMoreData();
    // }
  }, [page]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
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

      <div className="loading" ref={loader}>
        {loading2 && (
          <div className="max-w-lg flex flex-col items-center justify-center">
            <Rings
              width={100}
              height={100}
              color="#00A0D5"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        )}
      </div>
    </div>
  );
}
