import { useState, useEffect } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ChatPicture } from "@/constants/icons";

export default function Chat() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    document.title = "My chats - SOS Travelers";
    if (loginModal) {
      console.log("entrando");
      setOpen(false);
      setLoginModal(false);
      // router.push("/");
    }
    if (user) {
      setChats([
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
      ]);
    } else {
      setOpen(true);
    }
  }, [loginModal]);
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      <p className="text-center text-greyText max-w-lg lg:my-4 xl:my-4">
        No chats yet
      </p>
      <div className="max-w-lg text-xl my-3 flex justify-center">
        <ChatPicture />
      </div>

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
