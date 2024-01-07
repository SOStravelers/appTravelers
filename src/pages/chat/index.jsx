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
      console.log(response.data.docs);
      setChats(response.data.docs);
    }
    setLoading(false);
  };

  const handleGoToChat = (chat) => {
    router.push({
      pathname: `/chat/${chat._id}`,
      query: {
        name: `${chat?.receptor.personalData?.name?.first} ${
          chat?.receptor.personalData?.name?.last ?? ""
        }`,
        avatar:
          chat.receptor.img.imgUrl === ""
            ? "/assets/proovedor.png"
            : chat.receptor.img.imgUrl,
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
            name={`${chat?.receptor.personalData?.name?.first} ${
              chat?.receptor.personalData?.name?.last ?? ""
            }`}
            service={""}
            img={
              chat.receptor.img.imgUrl === ""
                ? "/assets/proovedor.png"
                : chat.receptor.img.imgUrl
            }
            score={chat.receptor.rating}
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
