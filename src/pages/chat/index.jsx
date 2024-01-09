import { useState, useEffect } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import ChatService from "@/services/ChatService";
import { useStore } from "@/store";
import { Rings } from "react-loader-spinner";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ChatPicture } from "@/constants/icons";

export default function Chat() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleGoToChat = async (chat) => {
    const body = {
      markAsRead: true,
      chatRoom: chat.id,
    };
    const response = await ChatService.markAsRead(body);
    if (response) console.log(response);
    router.push({
      pathname: `/chat/${chat._id}`,
      query: {
        name: `${chat?.worker.personalData?.name?.first} ${
          chat?.worker.personalData?.name?.last ?? ""
        }`,
        avatar:
          chat.worker.img.imgUrl === ""
            ? "/assets/proovedor.png"
            : chat.worker.img.imgUrl,
        idClient: chat.client._id,
        idWorker: chat.worker._id,
        chatId: chat._id,
      },
    });
  };
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      {loading && (
        <Rings
          width={100}
          height={100}
          color="#00A0D5"
          ariaLabel="infinity-spin-loading"
        />
      )}
      {chats?.length > 0 ? (
        chats.map((chat, index) => (
          <WorkerCardChat
            key={index}
            name={`${chat?.worker.personalData?.name?.first} ${
              chat?.worker.personalData?.name?.last ?? ""
            }`}
            service={""}
            img={
              chat.worker.img.imgUrl === ""
                ? "/assets/proovedor.png"
                : chat.worker.img.imgUrl
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
