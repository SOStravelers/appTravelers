"useClient";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import WorkerProfileCardChat from "@/components/utils/cards/WorkerProfileCardChat";
import ChatClient from "@/components/chat/ChatClient";
import ChatService from "@/services/ChatService";
import { Rings } from "react-loader-spinner";
import { fullName } from "@/utils/format";
export default function PersonalChat() {
  const store = useStore();
  const { setService } = store;
  const router = useRouter();
  const [initialMessages, setInitialMessages] = useState([]);
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState({});
  const [chatId, setChatId] = useState("");
  const socket = useRef();
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    document.title = "Chat | SOS Travelers";
    setService({});
    if (user) {
      console.log("conect socket chat");
      const host = process.env.NEXT_PUBLIC_API_SOCKET_IO;
      // console.log(host);
      socket.current = io(host);
      socket.current.emit("add-user", user);
      const id = router.query.id;
      setChatId(id);
      fetchData(id);
    }
    // Función de limpieza
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);
  async function fetchData(id) {
    try {
      const response = await ChatService.getById(id);
      const booking = response.data.booking;

      setBooking(booking);
      setWorker(booking.workerUser);

      const messagesResponse = await ChatService.getMessages({
        from: booking.workerUser._id,
        to: booking.clientUser._id,
        chatRoom: id,
      });

      // console.log("los mensajes", messagesResponse.data);
      setInitialMessages(messagesResponse.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.error(error);
    }
  }

  return (
    <div className="bg-white w-screen py-16 px-5 md:pl-80  max-h-screen">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p>Searching...</p>
        </div>
      ) : (
        <>
          <WorkerProfileCardChat
            idBooking={booking?._id}
            avatar={worker?.img?.imgUrl}
            service={booking?.service?.name}
            subservice={booking?.subservice?.name}
            name={fullName(worker?.personalData?.name)}
            location={booking?.businessUser?.businessData?.name}
            date={booking?.date?.stringData}
            time={booking?.startTime?.stringData}
          />
          <ChatClient
            chatId={chatId}
            idWorker={worker?._id}
            idClient={booking?.clientUser?._id}
            socket={socket}
            initialMessages={initialMessages}
          />
        </>
      )}
    </div>
  );
}
