import { useState, useEffect, useRef } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import ChatService from "@/services/ChatService";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import { Rings } from "react-loader-spinner";
import { useRouter } from "next/router";
import { ChatPicture } from "@/constants/icons";

export default function Chat() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  var userId = Cookies.get("auth.user_id");

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
    if (userId) {
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
          if (chat.receptor === userId) {
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
    setLoading(false);
  };

  const handleGoToChat = async (chat) => {
    const body = {
      markAsRead: true,
      chatRoom: chat.id,
    };
    const response = await ChatService.markAsRead(body);
    if (response) console.log(response);
    router.push({
      pathname: `/worker/chat/${chat._id}`,
    });
  };
  const fullName = (data) => {
    if (!data) return "";
    const { first, last } = data;
    return first + " " + (last ?? "");
  };
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-16 px-3 md:pl-80">
      <h1 className="my-1   text-center max-w-lg">My chats</h1>
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
      ) : chats?.length > 0 ? (
        chats.map((chat, index) => (
          <WorkerCardChat
            key={index}
            name={fullName(chat?.booking?.clientUser?.personalData?.name)}
            service={`${chat?.booking?.service?.name} | ${chat?.booking?.subservice?.name}`}
            subservice={chat?.booking?.subservice?.name}
            img={
              chat?.booking?.clientUser?.img?.imgUrl || "/assets/proovedor.png"
            }
            date={chat?.booking?.date?.stringData}
            time={chat?.booking?.startTime?.stringData}
            lastMesssage={chat?.lastMessage?.body?.message?.text}
            showArrow={
              chat?.lastMessage?.read === false &&
              chat?.lastMessage?.body?.sender !== userId
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

      {!userId && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
