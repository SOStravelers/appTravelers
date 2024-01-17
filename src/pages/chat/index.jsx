import { useState, useEffect } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import ChatService from "@/services/ChatService";
import { useStore } from "@/store";
import { Rings } from "react-loader-spinner";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ChatPicture } from "@/constants/icons";
import { fullName } from "@/utils/format";
export default function Chat() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    document.title = "My chats | SOS Travelers";
    if (loginModal) {
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
          if (chat.receptor._id === user) {
            chat.client = chat.receptor;
            chat.worker = chat.creator;
          } else {
            chat.client = chat.creator;
            chat.worker = chat.receptor;
          }
        });
      }
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
      pathname: `/chat/${chat._id}`,
    });
  };
  return (
    <div className="p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">My Chat</h1>
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : chats?.length > 0 ? (
        chats.map((chat, index) => (
          <WorkerCardChat
            key={index}
            name={fullName(chat?.booking?.workerUser?.personalData?.name)}
            service={`${chat?.booking?.service?.name} | ${chat?.booking?.subservice?.name}`}
            subservice={chat?.booking?.subservice?.name}
            img={
              chat.worker.img.imgUrl === ""
                ? "/assets/proovedor.png"
                : chat.worker.img.imgUrl
            }
            lastMesssage={chat?.lastMessage?.body?.message?.text}
            date={chat?.booking?.date?.stringData}
            time={chat?.booking?.startTime?.stringData}
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
