"useClient";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import WorkerProfileCardChat from "@/components/utils/cards/WorkerProfileCardChat";
import ChatClient from "@/components/chat/ChatClient";
import ChatService from "@/services/ChatService";

export default function PersonalChat() {
  const router = useRouter();
  const [initialMessages, setInitialMessages] = useState([]);
  const { idWorker, idClient } = router.query;
  const socket = useRef();
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    document.title = "Chat | SOS Travelers";
    if (user) {
      console.log("conect socket chat");
      const host = process.env.NEXT_PUBLIC_API_SOCKET_IO;
      console.log(host);
      socket.current = io(host);
      socket.current.emit("add-user", idClient);

      ChatService.getMessages({
        from: idClient,
        to: idWorker,
      }).then((response) => {
        console.log(response.data);
        setInitialMessages(response.data);
      });
    }
  }, [user]);

  return (
    <div className="bg-white w-screen py-28 px-5 md:pl-80 max-h-screen">
      <WorkerProfileCardChat />
      <ChatClient socket={socket} initialMessages={initialMessages} />
    </div>
  );
}
