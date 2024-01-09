import { useState, useEffect, useRef } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import ChatService from "@/services/ChatService";
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
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    document.title = "My chats | SOS Travelers";
    if (loginModal) {
      console.log("entrando");
      setOpen(false);
      setLoginModal(false);
      // router.push("/");
    }
    if (user) {
      getChatRooms();
    } else {
      setOpen(true);
    }
  }, [loginModal]);

  const getChatRooms = async () => {
    const response = await ChatService.getChatRooms();
    if (response) {
      const unformattedChats = response.data.docs;
      if (unformattedChats?.length > 0) {
        unformattedChats.map((chat) => {
          if (chat.receptor === user) {
            chat.worker = chat.receptor;
            chat.client = chat.creator;
          } else {
            chat.worker = chat.creator;
            chat.client = chat.receptor;
          }
        });
      }
      console.log(unformattedChats);
      setChats(unformattedChats);
    }
  };

  const handleGoToChat = (chat) => {
    router.push({
      pathname: `/worker/chat/${chat._id}`,
      query: {
        name: `${chat?.client?.personalData?.name?.first} ${
          chat?.client?.personalData?.name?.last ?? ""
        }`,
        avatar:
          chat.client?.img?.imgUrl === ""
            ? "/assets/proovedor.png"
            : chat.client?.img.imgUrl,
        idClient: chat.client._id,
        idWorker: chat.worker._id,
      },
    });
  };
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      {chats?.length > 0 ? (
        chats.map((chat, index) => (
          <WorkerCardChat
            key={index}
            name={`${chat?.client?.personalData?.name?.first} ${
              chat?.client?.personalData?.name?.last ?? ""
            }`}
            service={""}
            img={
              chat.client?.img.imgUrl === ""
                ? "/assets/proovedor.png"
                : chat.client?.img.imgUrl
            }
            lastMesssage={chat?.lastMessage?.body?.message?.text}
            showArrow={
              chat?.lastMessage?.read === false &&
              chat?.lastMessage?.body?.sender !== user
                ? true
                : false
            }
            onClick={() => handleGoToChat(chat)}
          />
        ))
      ) : (
        <div className="text-xl my-3 flex flex-col items-center justify-center px-3 md:pl-40">
          <p className="text-center text-greyText max-w-lg lg:my-4 xl:my-4">
            No chats yet
          </p>
          <ChatPicture />
        </div>
      )}

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
