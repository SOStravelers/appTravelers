import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const user = Cookies.get("auth.user_id");

  useEffect(() => {
    if (user) {
      setChats([
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
      ]);
    } else {
      setOpen(true);
    }
  }, []);
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-28 px-5 md:pl-80">
      <p className="text-center text-greyText max-w-lg my-10">No chats yet</p>
      {chats.map((chat, index) => (
        <WorkerCardChat
          key={index}
          name={chat.name}
          service={chat.service}
          score={chat.score}
          link={chat.link}
        />
      ))}
      {!user && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
